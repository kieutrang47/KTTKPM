/**
 * BÀI 5 - FOOD DELIVERY MONOLITH
 * ══════════════════════════════════════════════════════════════
 * 3 chức năng trong 1 app:
 *   1. Users Management (đăng ký, xem profile)
 *   2. Menu Management (xem, thêm món ăn)
 *   3. Order Management (đặt hàng, theo dõi đơn)
 * 
 * Chạy tại: http://localhost:5001
 * ══════════════════════════════════════════════════════════════
 */
const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

// CORS đơn giản
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "fooddb",
  port: 5432,
});

async function waitDB() {
  while (true) {
    try { await pool.query("SELECT 1"); console.log("✅ Food DB OK!"); break; }
    catch { console.log("⏳ Chờ DB..."); await new Promise(r => setTimeout(r, 2000)); }
  }
}

// ─── TRANG CHỦ ────────────────────────────────────────────────
app.get("/", (req, res) => res.json({
  app:          "🍜 FOOD DELIVERY - MONOLITH",
  architecture: "Monolith - 3 chức năng trong 1 app",
  port:         5001,
  api: {
    users: {
      "GET /api/users":         "Danh sách users",
      "GET /api/users/:id":     "Chi tiết user",
      "POST /api/users":        "Đăng ký { name, email, phone, address }",
    },
    menu: {
      "GET /api/menu":          "Xem toàn bộ menu",
      "GET /api/menu/:id":      "Chi tiết món",
      "GET /api/menu?category": "Lọc theo category",
      "POST /api/menu":         "Thêm món { name, price, category, description }",
    },
    orders: {
      "GET /api/orders":              "Tất cả đơn hàng",
      "GET /api/orders/:id":          "Chi tiết đơn",
      "GET /api/orders/user/:userId": "Đơn theo user",
      "POST /api/orders":             "Đặt hàng { user_id, delivery_address, items: [{menu_item_id, quantity}] }",
      "PUT /api/orders/:id/status":   "Cập nhật trạng thái { status }",
    },
  },
}));

// ══════════════════════════════════════════════════════════════
// CHỨC NĂNG 1: USERS
// ══════════════════════════════════════════════════════════════
app.get("/api/users", async (req, res) => {
  const r = await pool.query("SELECT * FROM users ORDER BY id");
  res.json({ total: r.rowCount, data: r.rows });
});

app.get("/api/users/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy user" });
  res.json(r.rows[0]);
});

app.post("/api/users", async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Cần name và email" });
  try {
    const r = await pool.query(
      "INSERT INTO users(name,email,phone,address) VALUES($1,$2,$3,$4) RETURNING *",
      [name, email, phone, address]
    );
    res.status(201).json({ message: "Đăng ký thành công!", user: r.rows[0] });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// CHỨC NĂNG 2: MENU
// ══════════════════════════════════════════════════════════════
app.get("/api/menu", async (req, res) => {
  const { category } = req.query;
  let query = "SELECT * FROM menu_items WHERE is_available=true";
  const params = [];
  if (category) { query += " AND category=$1"; params.push(category); }
  query += " ORDER BY category, name";
  const r = await pool.query(query, params);
  res.json({ total: r.rowCount, data: r.rows });
});

app.get("/api/menu/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM menu_items WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy món" });
  res.json(r.rows[0]);
});

app.post("/api/menu", async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Cần name và price" });
  const r = await pool.query(
    "INSERT INTO menu_items(name,description,price,category,image_url) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [name, description, price, category || "food", image_url]
  );
  res.status(201).json(r.rows[0]);
});

// ══════════════════════════════════════════════════════════════
// CHỨC NĂNG 3: ORDERS
// ══════════════════════════════════════════════════════════════
app.get("/api/orders", async (req, res) => {
  const r = await pool.query(`
    SELECT fo.*, u.name AS user_name, u.phone, u.email,
           json_agg(json_build_object(
             'item_id', oi.menu_item_id,
             'name', mi.name,
             'quantity', oi.quantity,
             'unit_price', oi.unit_price,
             'subtotal', oi.subtotal
           )) AS items
    FROM food_orders fo
    JOIN users u ON fo.user_id = u.id
    LEFT JOIN order_items oi ON fo.id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
    GROUP BY fo.id, u.name, u.phone, u.email
    ORDER BY fo.id DESC
  `);
  res.json({ total: r.rowCount, data: r.rows });
});

app.get("/api/orders/user/:userId", async (req, res) => {
  const r = await pool.query(`
    SELECT fo.*, json_agg(json_build_object('name', mi.name, 'quantity', oi.quantity, 'subtotal', oi.subtotal)) AS items
    FROM food_orders fo
    LEFT JOIN order_items oi ON fo.id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE fo.user_id = $1
    GROUP BY fo.id ORDER BY fo.id DESC
  `, [req.params.userId]);
  res.json({ user_id: req.params.userId, orders: r.rows });
});

app.get("/api/orders/:id", async (req, res) => {
  const r = await pool.query(`
    SELECT fo.*, u.name AS user_name, u.phone,
           json_agg(json_build_object('name', mi.name, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'subtotal', oi.subtotal)) AS items
    FROM food_orders fo
    JOIN users u ON fo.user_id = u.id
    LEFT JOIN order_items oi ON fo.id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
    WHERE fo.id = $1
    GROUP BY fo.id, u.name, u.phone
  `, [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy đơn" });
  res.json(r.rows[0]);
});

app.post("/api/orders", async (req, res) => {
  const { user_id, delivery_address, items, note } = req.body;
  if (!user_id || !delivery_address || !items?.length)
    return res.status(400).json({ error: "Cần user_id, delivery_address, items[]" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Tính tổng tiền
    let total = 0;
    const itemDetails = [];
    for (const item of items) {
      const m = await client.query("SELECT * FROM menu_items WHERE id=$1 AND is_available=true", [item.menu_item_id]);
      if (!m.rows.length) throw new Error(`Món id=${item.menu_item_id} không tồn tại hoặc hết hàng`);
      const subtotal = m.rows[0].price * item.quantity;
      total += subtotal;
      itemDetails.push({ ...m.rows[0], quantity: item.quantity, subtotal });
    }

    // Tạo order
    const order = await client.query(
      "INSERT INTO food_orders(user_id,delivery_address,total_amount,note) VALUES($1,$2,$3,$4) RETURNING *",
      [user_id, delivery_address, total, note]
    );
    const orderId = order.rows[0].id;

    // Thêm order items
    for (const item of itemDetails) {
      await client.query(
        "INSERT INTO order_items(order_id,menu_item_id,quantity,unit_price,subtotal) VALUES($1,$2,$3,$4,$5)",
        [orderId, item.id, item.quantity, item.price, item.subtotal]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: "🎉 Đặt hàng thành công!",
      order:   order.rows[0],
      items:   itemDetails.map(i => ({ name: i.name, quantity: i.quantity, subtotal: i.subtotal })),
      total,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: e.message });
  } finally { client.release(); }
});

app.put("/api/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: `Status phải là: ${validStatuses.join(", ")}` });
  const r = await pool.query("UPDATE food_orders SET status=$1 WHERE id=$2 RETURNING *", [status, req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy đơn" });
  res.json({ message: "Cập nhật thành công!", order: r.rows[0] });
});

// ─── KHỞI ĐỘNG ────────────────────────────────────────────────
waitDB().then(() => app.listen(3000, () => {
  console.log("🍜 Food Delivery MONOLITH chạy tại http://localhost:5001");
  console.log("   GET  /              → API docs");
  console.log("   GET  /api/menu      → Xem menu");
  console.log("   POST /api/orders    → Đặt hàng");
}));
