/**
 * BÀI 4 - ORCHESTRATOR (Orchestration pattern)
 * ══════════════════════════════════════════════════════════════
 * Orchestrator là "nhạc trưởng" - biết toàn bộ workflow,
 * gọi từng service theo đúng thứ tự, xử lý lỗi tập trung.
 * 
 * Flow đặt đồ ăn (Orchestration):
 *  Client → Orchestrator
 *               ├──→ Step 1: Order-Service.createOrder()
 *               ├──→ Step 2: Payment-Service.processPayment()
 *               ├──→ Step 3: Notification-Service.sendNotification()
 *               └──→ Trả kết quả về Client
 * 
 * ÚU ĐIỂM: dễ debug, flow rõ ràng, xử lý lỗi tập trung
 * NHƯỢC ĐIỂM: orchestrator là single point of failure
 * ══════════════════════════════════════════════════════════════
 */
const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());

const ORDER_SVC  = process.env.ORDER_SVC_URL  || "http://order-service:3000";
const PAY_SVC    = process.env.PAY_SVC_URL    || "http://payment-service:3000";
const NOTIF_SVC  = process.env.NOTIF_SVC_URL  || "http://notification-service:3000";

const workflowLogs = [];

// HTTP helpers
function call(method, url, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname,
      method,
      headers: body
        ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) }
        : {},
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// ── Workflow chính ──────────────────────────────────────────────
app.post("/place-order", async (req, res) => {
  const { user_id, item, amount } = req.body;
  if (!user_id || !item || !amount)
    return res.status(400).json({ error: "Cần user_id, item, amount" });

  const wfLog = {
    workflow_id: `WF-${Date.now()}`,
    started_at: new Date().toISOString(),
    steps: [],
    status: "running",
  };
  workflowLogs.push(wfLog);
  console.log(`\n🎯 Orchestrator bắt đầu workflow ${wfLog.workflow_id}`);

  try {
    // ── STEP 1: Tạo đơn hàng ─────────────────────────────────
    console.log("  📋 Step 1: Gọi Order-Service...");
    const step1 = await call("POST", `${ORDER_SVC}/orders`, { user_id, item, amount });
    wfLog.steps.push({ step: 1, name: "Create Order", status: step1.status === 201 ? "ok" : "failed", result: step1.body });
    if (step1.status !== 201) throw new Error(`Order creation failed: ${JSON.stringify(step1.body)}`);
    const order = step1.body;

    // ── STEP 2: Xử lý thanh toán ─────────────────────────────
    console.log("  💳 Step 2: Gọi Payment-Service...");
    const step2 = await call("POST", `${PAY_SVC}/pay`, { order_id: order.id, user_id, amount });
    wfLog.steps.push({ step: 2, name: "Process Payment", status: step2.status === 200 ? "ok" : "failed", result: step2.body });
    if (step2.status !== 200) throw new Error(`Payment failed: ${JSON.stringify(step2.body)}`);
    const payment = step2.body;

    // ── STEP 3: Gửi thông báo ────────────────────────────────
    console.log("  🔔 Step 3: Gọi Notification-Service...");
    const step3 = await call("POST", `${NOTIF_SVC}/notify`, {
      user_id,
      message: `✅ Đặt hàng thành công! Order #${order.id} - ${item} - ${amount.toLocaleString()}đ`,
    });
    wfLog.steps.push({ step: 3, name: "Send Notification", status: "ok", result: step3.body });

    wfLog.status = "completed";
    wfLog.completed_at = new Date().toISOString();
    console.log(`  ✅ Workflow ${wfLog.workflow_id} hoàn thành!`);

    res.status(201).json({
      message: "✅ Đặt hàng thành công (Orchestration)!",
      workflow_id: wfLog.workflow_id,
      order,
      payment,
    });
  } catch (error) {
    wfLog.status = "failed";
    wfLog.error   = error.message;
    console.log(`  ❌ Workflow thất bại: ${error.message}`);
    res.status(500).json({ error: error.message, workflow_id: wfLog.workflow_id });
  }
});

app.get("/workflows", (req, res) => res.json({ pattern: "ORCHESTRATION", workflows: workflowLogs }));

app.get("/", (req, res) => res.json({
  service: "orchestrator",
  pattern: "ORCHESTRATION",
  mo_ta: "Nhạc trưởng điều phối toàn bộ workflow đặt hàng",
  endpoints: {
    "POST /place-order": "Bắt đầu workflow đặt hàng { user_id, item, amount }",
    "GET /workflows":    "Xem lịch sử workflows",
  },
  workflow_steps: [
    "1. Gọi Order-Service → tạo đơn",
    "2. Gọi Payment-Service → thanh toán",
    "3. Gọi Notification-Service → thông báo",
  ],
}));

app.listen(3000, () => console.log("🎯 Orchestrator chạy tại :4005"));
