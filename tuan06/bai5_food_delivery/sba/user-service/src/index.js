/** BÀI 5 SBA - USER SERVICE (:5002) */
const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
app.use((req, res, next) => { res.header("Access-Control-Allow-Origin","*"); next(); });

const pool = new Pool({ host: process.env.DB_HOST||"db", user:"postgres", password:"123456", database:"fooddb", port:5432 });
async function waitDB() { while(true){try{await pool.query("SELECT 1");console.log("✅ User-Svc OK");break;}catch{await new Promise(r=>setTimeout(r,2000));}} }

app.get("/", (req, res) => res.json({ service: "user-service", port: 5002 }));
app.get("/api/users", async (req, res) => {
  const r = await pool.query("SELECT * FROM users ORDER BY id");
  res.json(r.rows);
});
app.get("/api/users/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy user" });
  res.json(r.rows[0]);
});
app.post("/api/users", async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Cần name, email" });
  try {
    const r = await pool.query(
      "INSERT INTO users(name,email,phone,address) VALUES($1,$2,$3,$4) RETURNING *",
      [name,email,phone,address]
    );
    res.status(201).json({ message: "Đăng ký thành công!", user: r.rows[0] });
  } catch(e){ res.status(400).json({error: e.message}); }
});

waitDB().then(()=>app.listen(3000,()=>console.log("👤 Food User-Service :5002")));
