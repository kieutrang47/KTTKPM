/** BÀI 5 SBA - ORDER SERVICE (:5004) */
const express = require("express");
const { Pool } = require("pg");
const http = require("http");
const app = express();
app.use(express.json());
app.use((req, res, next) => { res.header("Access-Control-Allow-Origin","*"); next(); });

const pool = new Pool({ host: process.env.DB_HOST||"db", user:"postgres", password:"123456", database:"fooddb", port:5432 });
const USER_SVC = process.env.USER_SVC_URL || "http://user-service:3000";
const MENU_SVC = process.env.MENU_SVC_URL || "http://menu-service:3000";

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on("error", reject);
  });
}

async function waitDB() { while(true){try{await pool.query("SELECT 1");console.log("✅ Order-Svc OK");break;}catch{await new Promise(r=>setTimeout(r,2000));}} }

app.get("/", (req, res) => res.json({ service: "order-service", port: 5004 }));

app.get("/api/orders", async (req, res) => {
  const r = await pool.query(`
    SELECT fo.*, json_agg(json_build_object('item_id', oi.menu_item_id, 'quantity', oi.quantity, 'subtotal', oi.subtotal)) as items
    FROM food_orders fo LEFT JOIN order_items oi ON fo.id = oi.order_id
    GROUP BY fo.id ORDER BY fo.id DESC
  `);
  res.json(r.rows);
});

app.post("/api/orders", async (req, res) => {
  const { user_id, delivery_address, items, note } = req.body;
  if (!user_id || !delivery_address || !items?.length)
    return res.status(400).json({ error: "Cần user_id, delivery_address, items[]" });

  try {
    // 1. Verify User
    const userRes = await httpGet(`${USER_SVC}/api/users/${user_id}`);
    if (userRes.status !== 200) return res.status(404).json({ error: "User không tồn tại" });

    // 2. Fetch Menu Items details from Menu-Service
    let total = 0;
    const itemDetails = [];
    for (const item of items) {
      const menuRes = await httpGet(`${MENU_SVC}/api/menu/${item.menu_item_id}`);
      if (menuRes.status !== 200) return res.status(404).json({ error: `Món id=${item.menu_item_id} không tìm thấy` });
      const menuItem = menuRes.body;
      if (!menuItem.is_available) return res.status(400).json({ error: `Món ${menuItem.name} tạm hết` });
      
      const subtotal = menuItem.price * item.quantity;
      total += subtotal;
      itemDetails.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: item.quantity, subtotal });
    }

    // 3. Save Order (dùng transaction)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const orderRes = await client.query(
        "INSERT INTO food_orders(user_id, delivery_address, total_amount, note) VALUES($1,$2,$3,$4) RETURNING *",
        [user_id, delivery_address, total, note]
      );
      const orderId = orderRes.rows[0].id;
      
      for (const it of itemDetails) {
        await client.query(
          "INSERT INTO order_items(order_id, menu_item_id, quantity, unit_price, subtotal) VALUES($1,$2,$3,$4,$5)",
          [orderId, it.id, it.quantity, it.price, it.subtotal]
        );
      }
      await client.query("COMMIT");
      
      res.status(201).json({
        message: "✅ Đặt hàng thành công qua SBA!",
        order: orderRes.rows[0],
        user: { id: user_id, name: userRes.body.name },
        items: itemDetails
      });
    } catch(err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

waitDB().then(()=>app.listen(3000,()=>console.log("🛒 Food Order-Service :5004")));
