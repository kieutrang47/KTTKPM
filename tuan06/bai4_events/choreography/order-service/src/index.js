/**
 * ORDER SERVICE - Choreography
 * - Nhận request đặt hàng từ client
 * - Publish event "ORDER_CREATED" lên Event Bus
 * - Lắng nghe "PAYMENT_DONE" để cập nhật trạng thái
 */
const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());

const EVENT_BUS = process.env.EVENT_BUS_URL || "http://event-bus:3000";
const MY_URL    = process.env.MY_URL || "http://order-service:3000";

const orders = []; // In-memory storage

// Publish helper
function publish(event, data) {
  const body = JSON.stringify({ event, data });
  const url  = new URL(`${EVENT_BUS}/publish`);
  return new Promise((resolve) => {
    const req = http.request({
      hostname: url.hostname, port: url.port, path: url.pathname, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, (res) => { res.resume(); resolve(); });
    req.on("error", (e) => console.log("❌ Publish error:", e.message));
    req.write(body);
    req.end();
  });
}

// Đăng ký nhận event PAYMENT_DONE khi khởi động
async function registerSubscriptions() {
  await new Promise(r => setTimeout(r, 3000)); // Chờ event-bus start
  const body = JSON.stringify({ event: "PAYMENT_DONE", callbackUrl: `${MY_URL}/webhook` });
  const url = new URL(`${EVENT_BUS}/subscribe`);
  const req = http.request({
    hostname: url.hostname, port: url.port, path: url.pathname, method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  }, () => console.log("✅ Order-Service đăng ký lắng nghe PAYMENT_DONE"));
  req.write(body);
  req.end();
}

// ── Nhận request đặt hàng ──────────────────────────────────────
app.post("/orders", async (req, res) => {
  const { user_id, item, amount } = req.body;
  if (!user_id || !item || !amount) return res.status(400).json({ error: "Cần user_id, item, amount" });

  const order = { id: Date.now(), user_id, item, amount, status: "pending", created_at: new Date().toISOString() };
  orders.push(order);

  console.log(`\n📥 Order nhận được:`, order);

  // Publish ORDER_CREATED → payment-service sẽ tự biết xử lý
  await publish("ORDER_CREATED", order);
  console.log(`📤 Published: ORDER_CREATED`);

  res.status(201).json({ message: "Đặt hàng thành công! Event ORDER_CREATED đã gửi.", order });
});

// ── Webhook: nhận PAYMENT_DONE từ Event Bus ────────────────────
app.post("/webhook", (req, res) => {
  const { event, data } = req.body;
  console.log(`\n🔔 Nhận event: [${event}]`, data);
  if (event === "PAYMENT_DONE") {
    const order = orders.find(o => o.id === data.order_id);
    if (order) {
      order.status = "paid";
      console.log(`✅ Order #${order.id} cập nhật → PAID`);
    }
  }
  res.json({ received: true });
});

app.get("/orders", (req, res) => res.json({ pattern: "CHOREOGRAPHY", orders }));
app.get("/", (req, res) => res.json({ service: "order-service (choreography)" }));

registerSubscriptions();
app.listen(3000, () => console.log("🛒 Choreography Order-Service chạy tại :4002"));
