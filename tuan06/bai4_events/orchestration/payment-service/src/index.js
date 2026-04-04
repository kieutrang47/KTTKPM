/** PAYMENT SERVICE - Orchestration: chỉ xử lý payment khi được gọi */
const express = require("express");
const app = express();
app.use(express.json());
const payments = [];

app.post("/pay", async (req, res) => {
  const { order_id, user_id, amount } = req.body;
  await new Promise(r => setTimeout(r, 300)); // Giả lập latency
  const success = Math.random() > 0.1;
  const payment = {
    id: Date.now(), order_id, user_id, amount,
    status: success ? "success" : "failed",
    processed_at: new Date().toISOString(),
  };
  payments.push(payment);
  console.log(`💳 [Payment] ${success ? "✅" : "❌"} order #${order_id} - ${amount}đ`);
  if (!success) return res.status(400).json({ error: "Thanh toán thất bại", payment });
  res.json(payment);
});

app.get("/payments", (req, res) => res.json(payments));
app.get("/", (req, res) => res.json({ service: "payment-service (orchestration)" }));

app.listen(3000, () => console.log("💳 Orch Payment-Service chạy tại :4007"));
