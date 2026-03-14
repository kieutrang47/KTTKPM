import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    # Đọc biến môi trường APP_ENV, nếu không có thì mặc định là 'unknown'
    env = os.getenv('APP_ENV', 'unknown')

    color = "#27ae60" if env == "production" else "#e67e22"

    return f'''
    <html>
        <head>
            <title>Environment Check</title>
            <style>
                body {{ font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #2c3e50; color: white; }}
                .box {{ text-align: center; padding: 50px; border-radius: 15px; background: #34495e; box-shadow: 0 10px 20px rgba(0,0,0,0.3); border-top: 10px solid {color}; }}
                h1 {{ margin-bottom: 5px; }}
                .env-tag {{ font-size: 2em; font-weight: bold; color: {color}; text-transform: uppercase; }}
                p {{ opacity: 0.8; }}
            </style>
        </head>
        <body>
            <div class="box">
                <p>Hệ thống của Trang đang chạy trên:</p>
                <h1>MÔI TRƯỜNG</h1>
                <div class="env-tag">{env}</div>
                <p>--- Docker Environment Variable Exercise ---</p>
            </div>
        </body>
    </html>
    '''

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)