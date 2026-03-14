const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  // Giao diện HTML + CSS
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Docker Multi-stage Dashboard</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
                color: white; height: 100vh; display: flex; 
                justify-content: center; align-items: center; margin: 0;
            }
            .card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 40px; border-radius: 20px;
                box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37);
                border: 1px solid rgba(255,255,255,0.18);
                text-align: center; max-width: 500px;
            }
            h1 { color: #00d2ff; margin-bottom: 10px; }
            .status {
                display: inline-block; padding: 5px 15px;
                background: #27ae60; border-radius: 20px;
                font-size: 0.9em; font-weight: bold; margin-bottom: 20px;
            }
            ul { text-align: left; list-style-type: ; }
            li { margin: 10px 0; color: #ecf0f1; }
            .footer { margin-top: 20px; font-size: 0.8em; opacity: 0.7; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>DOCKER DASHBOARD</h1>
            <div class="status">● CONTAINER ACTIVE</div>
            <p>22642451, - <strong>Trang Nguyễn</strong> bài tập về docker</p>
            <hr style="border: 0.5px solid rgba(255,255,255,0.2)">
            <ul>
                <li><strong>Kỹ thuật:</strong> Multi-stage Build</li>
                <li><strong>Môi trường Build:</strong> Node.js 18 (Full)</li>
                <li><strong>Môi trường Chạy:</strong> Node.js 18-Alpine</li>
                <li><strong>Trạng thái:</strong> Tối ưu hóa dung lượng thành công!</li>
            </ul>
            <div class="footer">Đồ án - Software Engineering 2026</div>
        </div>
    </body>
    </html>
    `;

  res.end(htmlContent);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SUCCESS] Server dang chay ruc ro tai cong ${PORT}`);
});
