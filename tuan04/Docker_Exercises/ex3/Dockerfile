# 1. Chọn base image siêu nhẹ
FROM node:18-alpine

# 2. Tạo thư mục làm việc trong container
WORKDIR /app

# 3. Copy file cấu hình (nếu có) và code vào
COPY . .

# 4. Cài đặt thư viện và Build (Giả lập môi trường React)
# LƯU Ý: Nếu em chỉ làm bài tập Dockerfile, dòng này để học cú pháp
RUN npm install && npm run build --if-present

# 5. Cài đặt 'serve' để chạy trang web đã build
RUN npm install -g serve

# 6. Mở cổng 3000 (mặc định của React)
EXPOSE 3000

# 7. Chạy ứng dụng
CMD ["serve", "-s", "build"]