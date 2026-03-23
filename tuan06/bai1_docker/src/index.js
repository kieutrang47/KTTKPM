const express = require("express");
const { Client } = require("pg");

const app = express();

async function startApp() {
  // Dùng biến môi trường hoặc mặc định là 'db' (tên service trong compose)
  const client = new Client({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "testdb",
    port: 5432,
  });

  let connected = false;
  while (!connected) {
    try {
      await client.connect();
      console.log(" Đã kết nối Database thành công!");
      connected = true;
    } catch (err) {
      console.log("⏳ Database chưa sẵn sàng, đang thử lại sau 2 giây...");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  app.get("/", async (req, res) => {
    try {
      const result = await client.query("SELECT * FROM users");
      res.json(result.rows);
    } catch (error) {
      res.status(500).send("Lỗi truy vấn Database");
    }
  });

  app.listen(3000, () => {
    console.log(" Server đang chạy tại port 3000 (Map ra ngoài là 3001)");
  });
}

startApp();
