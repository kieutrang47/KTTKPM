const express = require("express");
const { Client } = require("pg");

const app = express();

const client = new Client({
  host: "db",
  user: "postgres",
  password: "123456",
  database: "testdb",
  port: 5432,
});

// retry connect DB
async function connectDB() {
  while (true) {
    try {
      await client.connect();
      console.log("Connected to DB");
      break;
    } catch (err) {
      console.log("Waiting for DB...");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

connectDB();

app.get("/", async (req, res) => {
  const result = await client.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
