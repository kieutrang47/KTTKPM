# 1. Sử dụng image Redis chính thức từ Docker Hub làm base image
FROM redis:latest

# 2. Copy file cấu hình Redis vào container
COPY redis.conf /usr/local/etc/redis/redis.conf

# 3. Mở cổng 6379 để Redis có thể nhận kết nối từ bên ngoài
EXPOSE 6379

# 4. Chạy Redis server với file cấu hình đã copy
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]