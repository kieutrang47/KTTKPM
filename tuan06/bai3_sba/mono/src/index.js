/**
 * BÀI 3 - MONOLITH
 * ════════════════════════════════════════
 * Tất cả 3 chức năng (Users, Products, Orders) trong 1 app duy nhất.
 * 
 * ┌─────────────────────────────────────────┐
 * │           MONOLITH APP (:3003)          │
 * │  ┌──────────┐ ┌──────────┐ ┌──────────┐│
 * │  │ /users   │ │/products │ │ /orders  ││
 * │  └──────────┘ └──────────┘ └──────────┘│
 * │            └──────┬──────┘             │
 * │               DB (1 pool)              │
 * └─────────────────────────────────────────┘
 * 
 * Vấn đề của Monolith:
 *  - Deploy 1 chức năng phải restart toàn bộ app
 *  - Scale toàn bộ dù chỉ 1 phần bận
 *  - Codebase lớn → khó maintain
 */
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "sbadb",
  port: 5432,
});

async function waitDB() {
  while (true) {
    try { await pool.query("SELECT 1"); console.log("✅ DB OK"); break; }
    catch { await new Promise(r => setTimeout(r, 2000)); }
  }
}

// ─── Trang chủ ────────────────────────────────────────────────
app.get("/", (req, res) => res.json({
  app: "MONOLITH - Tất cả trong 1",
  architecture: "Monolith",
  endpoints: {
    users:    ["GET /users", "POST /users", "GET /users/:id"],
    products: ["GET /products", "POST /products"],
    orders:   ["GET /orders", "POST /orders", "GET /orders/user/:userId"],
  },
  nhuoc_diem: [
    "Deploy 1 chức năng → restart toàn app",
    "Scale toàn bộ dù chỉ 1 module bận",
    "Bug 1 chức năng → ảnh hưởng toàn app",
  ],
}));

// ─── USERS MODULE ─────────────────────────────────────────────
app.get("/users", async (req, res) => {
  const r = await pool.query("SELECT * FROM users ORDER BY id");
  res.json({ module: "Users", data: r.rows });
});

app.get("/users/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(r.rows[0]);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Cần name và email" });
  try {
    const r = await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2) RETURNING *", [name, email]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ─── PRODUCTS MODULE ──────────────────────────────────────────
app.get("/products", async (req, res) => {
  const r = await pool.query("SELECT * FROM products ORDER BY id");
  res.json({ module: "Products", data: r.rows });
});

app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Cần name và price" });
  const r = await pool.query(
    "INSERT INTO products(name,price,stock) VALUES($1,$2,$3) RETURNING *",
    [name, price, stock || 0]
  );
  res.status(201).json(r.rows[0]);
});

// ─── ORDERS MODULE ────────────────────────────────────────────
app.get("/orders", async (req, res) => {
  const r = await pool.query(`
    SELECT o.*, u.name AS user_name, p.name AS product_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.id
  `);
  res.json({ module: "Orders", data: r.rows });
});

app.get("/orders/user/:userId", async (req, res) => {
  const r = await pool.query(`
    SELECT o.*, p.name AS product_name, p.price
    FROM orders o JOIN products p ON o.product_id = p.id
    WHERE o.user_id = $1 ORDER BY o.id
  `, [req.params.userId]);
  res.json({ user_id: req.params.userId, orders: r.rows });
});

app.post("/orders", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity)
    return res.status(400).json({ error: "Cần user_id, product_id, quantity" });
  try {
    // Lấy giá sản phẩm
    const prod = await pool.query("SELECT * FROM products WHERE id=$1", [product_id]);
    if (!prod.rows.length) return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    if (prod.rows[0].stock < quantity) return res.status(400).json({ error: "Không đủ hàng" });

    const total = prod.rows[0].price * quantity;
    // Tạo order
    const r = await pool.query(
      "INSERT INTO orders(user_id,product_id,quantity,total_price) VALUES($1,$2,$3,$4) RETURNING *",
      [user_id, product_id, quantity, total]
    );
    // Giảm stock
    await pool.query("UPDATE products SET stock=stock-$1 WHERE id=$2", [quantity, product_id]);
    res.status(201).json({ message: "Đặt hàng thành công!", order: r.rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── KHỞI ĐỘNG ────────────────────────────────────────────────
waitDB().then(() => app.listen(3000, () =>
  console.log("🏛️  Monolith chạy tại http://localhost:3003")
));
