/** ORDER SERVICE - Orchestration: chỉ nhận lệnh, không biết flow */
const express = require("express");
const app = express();
app.use(express.json());
const orders = [];

app.post("/orders", (req, res) => {
  const { user_id, item, amount } = req.body;
  const order = { id: Date.now(), user_id, item, amount, status: "created", created_at: new Date().toISOString() };
  orders.push(order);
  console.log(`📋 [Order] Tạo đơn:`, order);
  res.status(201).json(order);
});

app.get("/orders", (req, res) => res.json(orders));
app.get("/", (req, res) => res.json({ service: "order-service (orchestration)", note: "Chỉ tạo order khi được orchestrator gọi" }));

app.listen(3000, () => console.log("📋 Orch Order-Service chạy tại :4006"));
