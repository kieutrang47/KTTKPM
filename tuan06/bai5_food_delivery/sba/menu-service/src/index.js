/** BÀI 5 SBA - MENU SERVICE (:5003) */
const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
app.use((req, res, next) => { res.header("Access-Control-Allow-Origin","*"); res.header("Access-Control-Allow-Methods","*"); next(); });

const pool = new Pool({ host: process.env.DB_HOST||"db", user:"postgres", password:"123456", database:"fooddb", port:5432 });
async function waitDB() { while(true){try{await pool.query("SELECT 1");console.log("✅ Menu-Svc OK");break;}catch{await new Promise(r=>setTimeout(r,2000));}} }

app.get("/", (req, res) => res.json({ service: "menu-service", port: 5003 }));

app.get("/api/menu", async (req, res) => {
  const { category } = req.query;
  let query = "SELECT * FROM menu_items WHERE is_available=true";
  const params = [];
  if (category) { query += " AND category=$1"; params.push(category); }
  query += " ORDER BY category, name";
  const r = await pool.query(query, params);
  res.json(r.rows);
});

app.get("/api/menu/:id", async (req, res) => {
  const r = await pool.query("SELECT * FROM menu_items WHERE id=$1", [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: "Không tìm thấy món" });
  res.json(r.rows[0]);
});

app.post("/api/menu", async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Cần name, price" });
  const r = await pool.query(
    "INSERT INTO menu_items(name,description,price,category,image_url) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [name, description, price, category || "food", image_url]
  );
  res.status(201).json(r.rows[0]);
});

waitDB().then(()=>app.listen(3000,()=>console.log("🍔 Food Menu-Service :5003")));
