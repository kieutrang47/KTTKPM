# --- STAGE 1: BUILD
FROM node:18 AS builder
WORKDIR /build
COPY . .
# Gia su day la buoc cai dat va build nang
RUN npm install 

# --- STAGE 2: RUNTIME ---
FROM node:18-alpine
WORKDIR /app

# Chỉ copy những thứ cần thiết từ stage 'builder' sang
COPY --from=builder /build/app.js .

EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "app.js"]