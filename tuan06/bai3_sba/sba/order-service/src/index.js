/**
 * SBA - ORDER SERVICE (:3006)
 * Xử lý đặt hàng, gọi sang User-Service và Product-Service qua HTTP
 * 
 * Flow:
 *  Client → Order-Service
 *              ├→ User-Service   (xác nhận user tồn tại)
 *              ├→ Product-Service (xác nhận sản phẩm, giảm stock)
 *              └→ Lưu vào DB
 */
const express = require("express");
const { Pool } = require("pg");
const http = require("http");
const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "sbadb",
  port: 5432,
});

const USER_SERVICE_URL    = process.env.USER_SERVICE_URL    || "http://user-service:3000";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://product-service:3000";

// HTTP helper
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on("error", reject);
  });
}

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request({ ...options, headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) } }, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

async function waitDB() {
  while (true) {
    try { await pool.query("SELECT 1"); console.log("✅ Order-Service DB OK"); break; }
    catch { await new Promise(r => setTimeout(r, 2000)); }
  }
}

app.get("/", (req, res) => res.json({
  service: "order-service",
  port: 3006,
  giao_tiep: "Gọi User-Service + Product-Service qua HTTP",
  endpoints: ["GET /orders", "GET /orders/user/:userId", "POST /orders"],
}));

app.get("/orders", async (req, res) => {
  const r = await pool.query(`
    SELECT o.*, u.name AS user_name, p.name AS product_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.id
  `);
  res.json(r.rows);
});

app.get("/orders/user/:userId", async (req, res) => {
  const r = await pool.query(
    "SELECT o.*, p.name AS product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id=$1 ORDER BY o.id",
    [req.params.userId]
  );
  res.json(r.rows);
});

app.post("/orders", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity)
    return res.status(400).json({ error: "Cần user_id, product_id, quantity" });

  try {
    // BƯỚC 1: Xác nhận user tồn tại qua User-Service
    const userRes = await httpGet(`${USER_SERVICE_URL}/users/${user_id}`);
    if (userRes.status === 404) return res.status(404).json({ error: "User không tồn tại" });

    // BƯỚC 2: Lấy thông tin sản phẩm qua Product-Service
    const prodRes = await httpGet(`${PRODUCT_SERVICE_URL}/products/${product_id}`);
    if (prodRes.status === 404) return res.status(404).json({ error: "Sản phẩm không tồn tại" });

    const product = prodRes.body;
    const total = product.price * quantity;

    // BƯỚC 3: Giảm stock qua Product-Service
    const stockUrl = new URL(`${PRODUCT_SERVICE_URL}/products/${product_id}/stock`);
    const stockRes = await httpRequest(
      { hostname: stockUrl.hostname, port: stockUrl.port, path: stockUrl.pathname, method: "PUT" },
      { quantity }
    );
    if (stockRes.status !== 200) return res.status(400).json(stockRes.body);

    // BƯỚC 4: Lưu order vào DB
    const r = await pool.query(
      "INSERT INTO orders(user_id,product_id,quantity,total_price) VALUES($1,$2,$3,$4) RETURNING *",
      [user_id, product_id, quantity, total]
    );

    res.status(201).json({
      message: "✅ Đặt hàng thành công (qua SBA)!",
      order: r.rows[0],
      user: userRes.body,
      product: { name: product.name, price: product.price },
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

waitDB().then(() => app.listen(3000, () =>
  console.log("🛒 Order-Service chạy tại :3006")
));
