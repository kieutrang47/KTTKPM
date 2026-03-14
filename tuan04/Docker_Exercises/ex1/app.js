const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, Docker! Day la ket qua Bai 1 cua Trang");
});
server.listen(3000, "0.0.0.0", () => {
  console.log("Server dang chay tai cong 3000");
});
