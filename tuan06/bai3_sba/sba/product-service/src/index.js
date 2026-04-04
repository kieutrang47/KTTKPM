/**
 * SBA - PRODUCT SERVICE (:3005)
 * Chỉ xử lý logic liên quan đến Products
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
    try { await pool.query("SELECT 1"); console.log("✅ Product-Service DB OK"); break; }
    catch { await new Promise(r => setTimeout(r, 2000)); }
  }
}

app.get("/", (req, res) => res.json({
  service: "product-service",
  port: 3005,
  endpoints: ["GET /products", "GET /products/:id", "POST /products", "PUT /products/:id/stock"],
}));

app.get("/products", async (req, res) => {
  const r = await pool.query("SELECT * FROM products ORDER BY id");
  res.json(r.rows);
});

app.get("/products/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM products WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  res.json(r.rows[0]);
});

app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Cần name, price" });
  const r = await pool.query(
    "INSERT INTO products(name,price,stock) VALUES($1,$2,$3) RETURNING *",
    [name, price, stock || 0]
  );
  res.status(201).json(r.rows[0]);
});

// Internal API: Order-Service gọi để giảm stock
app.put("/products/:id/stock", async (req, res) => {
  const { quantity } = req.body;
  const prod = await pool.query("SELECT * FROM products WHERE id=$1", [req.params.id]);
  if (!prod.rows.length) return res.status(404).json({ error: "Không tìm thấy" });
  if (prod.rows[0].stock < quantity) return res.status(400).json({ error: "Không đủ hàng" });
  const r = await pool.query(
    "UPDATE products SET stock=stock-$1 WHERE id=$2 RETURNING *",
    [quantity, req.params.id]
  );
  res.json({ message: "Cập nhật stock OK", product: r.rows[0] });
});

waitDB().then(() => app.listen(3000, () =>
  console.log("📦 Product-Service chạy tại :3005")
));
