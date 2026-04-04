/**
 * NOTIFICATION SERVICE - Choreography
 * - Lắng nghe cả "PAYMENT_DONE" và "PAYMENT_FAILED"
 * - Gửi thông báo tới user (giả lập)
 */
const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());

const EVENT_BUS = process.env.EVENT_BUS_URL || "http://event-bus:3000";
const MY_URL    = process.env.MY_URL || "http://notification-service:3000";
const notifications = [];

async function registerSubscriptions() {
  await new Promise(r => setTimeout(r, 5000));
  for (const event of ["PAYMENT_DONE", "PAYMENT_FAILED", "ORDER_CREATED"]) {
    const body = JSON.stringify({ event, callbackUrl: `${MY_URL}/webhook` });
    const url = new URL(`${EVENT_BUS}/subscribe`);
    const req = http.request({
      hostname: url.hostname, port: url.port, path: url.pathname, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, () => console.log(`✅ Notification đăng ký lắng nghe [${event}]`));
    req.write(body);
    req.end();
    await new Promise(r => setTimeout(r, 200));
  }
}

app.post("/webhook", (req, res) => {
  const { event, data } = req.body;
  let message = "";

  if (event === "ORDER_CREATED") {
    message = `📧 Gửi email xác nhận đặt hàng thành công! Order #${data.id} - ${data.item}`;
  } else if (event === "PAYMENT_DONE") {
    message = `💚 SMS: Thanh toán thành công ${data.amount.toLocaleString()}đ cho Order #${data.order_id}`;
  } else if (event === "PAYMENT_FAILED") {
    message = `❗ SMS: Thanh toán thất bại cho Order #${data.order_id}. Vui lòng thử lại.`;
  }

  const notif = { event, message, data, sent_at: new Date().toISOString() };
  notifications.push(notif);
  console.log(`\n🔔 [Notification]: ${message}`);
  res.json({ received: true });
});

app.get("/notifications", (req, res) => res.json({ pattern: "CHOREOGRAPHY", notifications }));
app.get("/", (req, res) => res.json({ service: "notification-service (choreography)" }));

registerSubscriptions();
app.listen(3000, () => console.log("🔔 Notification-Service chạy tại :4004"));
