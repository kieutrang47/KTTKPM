/**
 * PAYMENT SERVICE - Choreography
 * - Lắng nghe "ORDER_CREATED" từ Event Bus
 * - Xử lý thanh toán (giả lập)
 * - Publish "PAYMENT_DONE" hoặc "PAYMENT_FAILED"
 */
const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());

const EVENT_BUS = process.env.EVENT_BUS_URL || "http://event-bus:3000";
const MY_URL    = process.env.MY_URL || "http://payment-service:3000";
const payments  = [];

function publish(event, data) {
  const body = JSON.stringify({ event, data });
  const url  = new URL(`${EVENT_BUS}/publish`);
  return new Promise((resolve) => {
    const req = http.request({
      hostname: url.hostname, port: url.port, path: url.pathname, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, (res) => { res.resume(); resolve(); });
    req.on("error", () => resolve());
    req.write(body);
    req.end();
  });
}

async function registerSubscriptions() {
  await new Promise(r => setTimeout(r, 4000));
  const body = JSON.stringify({ event: "ORDER_CREATED", callbackUrl: `${MY_URL}/webhook` });
  const url = new URL(`${EVENT_BUS}/subscribe`);
  const req = http.request({
    hostname: url.hostname, port: url.port, path: url.pathname, method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  }, () => console.log("✅ Payment-Service đăng ký lắng nghe ORDER_CREATED"));
  req.write(body);
  req.end();
}

// ── Webhook: nhận ORDER_CREATED ────────────────────────────────
app.post("/webhook", async (req, res) => {
  const { event, data } = req.body;
  console.log(`\n💳 [Payment] Nhận event: [${event}]`, data);

  if (event === "ORDER_CREATED") {
    // Giả lập xử lý thanh toán (90% thành công)
    await new Promise(r => setTimeout(r, 500));
    const success = Math.random() > 0.1;

    const payment = {
      id: Date.now(),
      order_id: data.id,
      user_id: data.user_id,
      amount: data.amount,
      status: success ? "success" : "failed",
      processed_at: new Date().toISOString(),
    };
    payments.push(payment);

    if (success) {
      console.log(`✅ Thanh toán thành công cho order #${data.id}`);
      await publish("PAYMENT_DONE", { ...payment, order_id: data.id });
    } else {
      console.log(`❌ Thanh toán thất bại cho order #${data.id}`);
      await publish("PAYMENT_FAILED", { ...payment, order_id: data.id });
    }
  }
  res.json({ received: true });
});

app.get("/payments", (req, res) => res.json({ pattern: "CHOREOGRAPHY", payments }));
app.get("/", (req, res) => res.json({ service: "payment-service (choreography)" }));

registerSubscriptions();
app.listen(3000, () => console.log("💳 Choreography Payment-Service chạy tại :4003"));
