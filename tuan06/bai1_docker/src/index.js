const express = require("express");
const { Client } = require("pg");
const os = require("os");

const app = express();
app.use(express.json());

// ─── KẾT NỐI DATABASE ───────────────────────────────────────
const client = new Client({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "testdb",
  port: 5432,
});

async function connectDB() {
  while (true) {
    try {
      await client.connect();
      console.log("✅ Đã kết nối Database!");
      break;
    } catch (err) {
      console.log("⏳ Đang thử kết nối lại sau 2s...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

// ─── ROUTE 1: Trang chủ - hiển thị Users từ DB ───────────────
app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users ORDER BY id");
    res.json({
      message: "🐳 Docker Fullstack App đang chạy!!!",
      container_hostname: os.hostname(),
      users: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ROUTE 2: Thông tin Docker & hệ thống ────────────────────
app.get("/docker-info", (req, res) => {
  res.json({
    bai: "BÀI 1 - DOCKER IMAGE OPTIMIZATION",
    concepts: {
      "Image Layer": {
        mo_ta:
          "Mỗi lệnh RUN/COPY tạo 1 layer (read-only). Container thêm 1 layer write lên trên.",
        tip: "Gộp nhiều RUN bằng && để giảm số layer",
        vi_du:
          "RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*",
      },
      Volume: {
        mo_ta: "Lưu trữ dữ liệu bền vững ngoài container vòng đời",
        named_volume:
          "pgdata:/var/lib/postgresql/data → Docker quản lý, bền vững",
        bind_mount: "./src:/app/src → sync real-time từ host (dùng lúc dev)",
      },
      Network: {
        mo_ta: "Kênh giao tiếp giữa containers",
        bridge: "Mặc định, containers trong compose nói chuyện qua tên service",
        host: "Dùng network của máy host (Linux only)",
        overlay: "Dùng cho Swarm/Kubernetes multi-host",
      },
      "CMD vs ENTRYPOINT": {
        CMD: 'CMD ["node","src/index.js"] → override được: docker run img python app.py',
        ENTRYPOINT:
          'ENTRYPOINT ["node"] → cố định, CMD thêm sau: docker run img src/index.js',
        best_practice:
          "Dùng ENTRYPOINT cho lệnh chính, CMD cho tham số mặc định",
      },
      "RUN vs CMD vs ENTRYPOINT": {
        RUN: "Chạy lúc BUILD image (tạo layer)",
        CMD: "Chạy khi container START (default command)",
        ENTRYPOINT: "Chạy khi container START (cố định command)",
      },
      "Multi-stage Build": {
        mo_ta: "Dùng nhiều FROM trong 1 Dockerfile",
        loi_ich: "Image cuối không chứa build tools → nhỏ hơn ~40%",
        so_sanh:
          "node:18 ≈ 900MB | node:18-alpine ≈ 170MB | multi-stage ≈ 120MB",
      },
    },
    container: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      memory_free_mb: Math.round(os.freemem() / 1024 / 1024),
      memory_total_mb: Math.round(os.totalmem() / 1024 / 1024),
      uptime_seconds: Math.round(os.uptime()),
      node_env: process.env.NODE_ENV || "development",
    },
  });
});

// ─── ROUTE 3: Thêm user ──────────────────────────────────────
app.post("/users", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Cần có trường name" });
  try {
    const result = await client.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name],
    );
    res.status(201).json({ message: "Thêm thành công!", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ROUTE 4: Health check ───────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── KHỞI ĐỘNG ───────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(3000, () => {
    console.log("🚀 Server chạy tại http://localhost:3000");
    console.log("📖 Endpoints:");
    console.log("   GET  /            → Danh sách users từ DB");
    console.log("   GET  /docker-info → Giải thích concepts Docker");
    console.log("   POST /users       → Thêm user { name }");
    console.log("   GET  /health      → Health check");
  });
}

start();
