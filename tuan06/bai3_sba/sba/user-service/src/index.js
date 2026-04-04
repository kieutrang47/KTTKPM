/**
 * SBA - USER SERVICE (:3004)
 * Chỉ xử lý logic liên quan đến Users
 * Kết nối trực tiếp shared DB (bảng users)
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
    try { await pool.query("SELECT 1"); console.log("✅ User-Service DB OK"); break; }
    catch { await new Promise(r => setTimeout(r, 2000)); }
  }
}

app.get("/", (req, res) => res.json({
  service: "user-service",
  port: 3004,
  endpoints: ["GET /users", "GET /users/:id", "POST /users"],
}));

app.get("/users", async (req, res) => {
  const r = await pool.query("SELECT * FROM users ORDER BY id");
  res.json(r.rows);
});

app.get("/users/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy user" });
  res.json(r.rows[0]);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Cần name, email" });
  try {
    const r = await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2) RETURNING *", [name, email]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

waitDB().then(() => app.listen(3000, () =>
  console.log("👤 User-Service chạy tại :3004")
));
