from flask import Flask
import os
app = Flask(__name__)
@app.route('/')
def hello():
    return f"<h1>Bai 3: Flask Load Balancing - ID: {os.uname()[1]}</h1>"
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
