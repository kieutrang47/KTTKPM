# 1. Sử dụng image Postgres
FROM postgres:15

# 2. Thiết lập biến môi trường (Bắt buộc để Postgres chạy)
ENV POSTGRES_PASSWORD=trang123
ENV POSTGRES_DB=my_beauty_db

# 3. Thiết lập thư mục làm việc
# Copy file SQL vào thư mục đặc biệt này. 
# Mọi file .sql ở đây sẽ tự động chạy khi container khởi động lần đầu.
COPY init.sql /docker-entrypoint-initdb.d/