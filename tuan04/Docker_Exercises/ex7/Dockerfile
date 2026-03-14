FROM python:3.9-slim

# Cài đặt Flask để làm giao diện
RUN pip install flask

WORKDIR /app
COPY app.py .

# ĐÂY LÀ YÊU CẦU BÀI TẬP: Khai báo biến môi trường mặc định
ENV APP_ENV=development

EXPOSE 5000

CMD ["python", "app.py"]