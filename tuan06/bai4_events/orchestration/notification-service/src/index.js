/** NOTIFICATION SERVICE - Orchestration */
const express = require("express");
const app = express();
app.use(express.json());
const notifications = [];

app.post("/notify", (req, res) => {
  const { user_id, message } = req.body;
  const notif = { id: Date.now(), user_id, message, sent_at: new Date().toISOString() };
  notifications.push(notif);
  console.log(`🔔 [Notification] → user ${user_id}: ${message}`);
  res.json({ sent: true, notification: notif });
});

app.get("/notifications", (req, res) => res.json(notifications));
app.get("/", (req, res) => res.json({ service: "notification-service (orchestration)" }));

app.listen(3000, () => console.log("🔔 Orch Notification-Service chạy tại :4008"));
