/**
 * BÀI 4 - EVENT BUS (Choreography pattern)
 * ══════════════════════════════════════════════════════════════
 * Đây là "bưu điện trung tâm" - nhận event từ service này,
 * forward tới các subscriber đã đăng ký lắng nghe event đó.
 * 
 * KHÔNG có ai biết flow tổng thể - mỗi service tự quyết định
 * "khi nhận event X thì tôi làm gì và publish event Y tiếp theo"
 * 
 * Flow đặt đồ ăn (Choreography):
 *  1. Client → POST /orders (order-service)
 *  2. order-service → publish "ORDER_CREATED"
 *  3. payment-service lắng nghe → xử lý → publish "PAYMENT_DONE"
 *  4. notification-service lắng nghe → gửi thông báo
 * ══════════════════════════════════════════════════════════════
 */
const express = require("express");
const app = express();
app.use(express.json());

// Lưu subscribers: { "EVENT_NAME": ["http://service-url/webhook"] }
const subscribers = {};
// Lịch sử events để demo
const eventLog = [];

// ── Đăng ký lắng nghe event ────────────────────────────────────
app.post("/subscribe", (req, res) => {
  const { event, callbackUrl } = req.body;
  if (!event || !callbackUrl) return res.status(400).json({ error: "Cần event và callbackUrl" });
  if (!subscribers[event]) subscribers[event] = [];
  if (!subscribers[event].includes(callbackUrl)) {
    subscribers[event].push(callbackUrl);
  }
  console.log(`📋 Đăng ký: ${callbackUrl} lắng nghe [${event}]`);
  res.json({ message: `Đã đăng ký lắng nghe ${event}`, subscribers: subscribers[event] });
});

// ── Publish event → forward tới tất cả subscriber ─────────────
app.post("/publish", async (req, res) => {
  const { event, data } = req.body;
  if (!event) return res.status(400).json({ error: "Cần event" });

  const entry = { event, data, timestamp: new Date().toISOString(), deliveredTo: [] };
  eventLog.push(entry);

  console.log(`\n📢 Event PUBLISHED: [${event}]`, data);
  const targets = subscribers[event] || [];

  // Forward tới từng subscriber (fire-and-forget)
  for (const url of targets) {
    try {
      const urlObj = new URL(url);
      const http = require("http");
      const postData = JSON.stringify({ event, data, timestamp: entry.timestamp });
      const reqHttp = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port || 80,
        path: urlObj.pathname,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) },
      }, (r) => {
        console.log(`  ✅ Delivered to ${url} → HTTP ${r.statusCode}`);
        entry.deliveredTo.push({ url, status: r.statusCode });
      });
      reqHttp.on("error", (e) => {
        console.log(`  ❌ Lỗi deliver to ${url}: ${e.message}`);
        entry.deliveredTo.push({ url, status: "error", error: e.message });
      });
      reqHttp.write(postData);
      reqHttp.end();
    } catch (e) {
      console.log(`  ❌ URL không hợp lệ: ${url}`);
    }
  }

  res.json({ message: `Event [${event}] đã broadcast`, targets: targets.length, log_entry: entry });
});

// ── Xem lịch sử events ──────────────────────────────────────────
app.get("/events", (req, res) => {
  res.json({ total: eventLog.length, events: eventLog.slice(-20) });
});

// ── Xem subscribers ─────────────────────────────────────────────
app.get("/subscribers", (req, res) => {
  res.json({ subscribers });
});

app.get("/", (req, res) => res.json({
  service: "event-bus",
  pattern: "CHOREOGRAPHY",
  mo_ta: "Trung gian nhận và forward events giữa các services",
  endpoints: {
    "POST /subscribe": "Đăng ký lắng nghe event { event, callbackUrl }",
    "POST /publish":   "Publish event { event, data }",
    "GET /events":     "Xem lịch sử events",
    "GET /subscribers":"Xem danh sách subscribers",
  },
}));

app.listen(3000, () => console.log("📮 Event Bus chạy tại :4001"));
