# 🚀 DEPLOY TỪ GIT - SIÊU NHANH

## 📋 Yêu Cầu
- 3 máy trong cùng mạng
- Mỗi máy cài Docker
- Code đã push lên Git

---

## ⚡ 4 BƯỚC DEPLOY

### BƯỚC 1: Clone Project (Trên Cả 3 Máy)

```bash
# Clone repository
git clone <repository-url>
cd <project-folder>
```

**Ví dụ:**
```bash
git clone https://github.com/your-username/food-delivery-sba.git
cd food-delivery-sba
```

---

### BƯỚC 2: Kiểm Tra IP

**Trên mỗi máy:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

**Ghi lại:**
- Máy 1: `192.168.x.x` (User + Redis + Frontend)
- Máy 2: `192.168.x.x` (Catalog)
- Máy 3: `192.168.x.x` (Order + Payment)

---

### BƯỚC 3: Cập Nhật IP

#### Trên Máy 1:
```bash
# Mở file
nano docker-compose-machine1.yml

# Tìm và thay đổi:
VITE_USER_API_URL=http://[IP_MÁY_1]:8081/users
VITE_CATALOG_API_URL=http://[IP_MÁY_2]:8082/menu
VITE_ORDER_API_URL=http://[IP_MÁY_3]:8083/orders
VITE_PAYMENT_API_URL=http://[IP_MÁY_3]:8084/payments
```

#### Trên Máy 3:
```bash
# Mở file
nano docker-compose-machine3.yml

# Tìm và thay đổi:
SPRING_DATA_REDIS_HOST=[IP_MÁY_1]
FOOD_SERVICE_URL=http://[IP_MÁY_2]:8082
USER_SERVICE_URL=http://[IP_MÁY_1]:8081
```

---

### BƯỚC 4: Chạy Docker Compose

#### Máy 1:
```bash
docker-compose -f docker-compose-machine1.yml up -d
```

#### Máy 2:
```bash
docker-compose -f docker-compose-machine2.yml up -d
```

#### Máy 3:
```bash
docker-compose -f docker-compose-machine3.yml up -d
```

---

## ✅ Kiểm Tra

```bash
# Trên mỗi máy
docker ps

# Test API
curl http://[IP_MÁY_1]:8081/users
curl http://[IP_MÁY_2]:8082/menu
curl http://[IP_MÁY_3]:8083/orders

# Truy cập Frontend
open http://[IP_MÁY_1]:3000
```

---

## 🎬 DEMO CHO GIẢNG VIÊN

### 1. Mở 3 Terminals:

**Terminal 1 (Máy 1):**
```bash
docker logs -f user-service
```

**Terminal 2 (Máy 2):**
```bash
docker logs -f catalog-service
```

**Terminal 3 (Máy 3):**
```bash
docker logs -f order-service
```

### 2. Mở Browser:
```
http://[IP_MÁY_1]:3000
```
- Mở DevTools (F12) → Network tab

### 3. Thực Hiện Flow:
1. Đăng ký → Request đến Máy 1 (8081)
2. Xem menu → Request đến Máy 2 (8082)
3. Đặt hàng → Request đến Máy 3 (8083)
4. Thanh toán → Request đến Máy 3 (8084)

### 4. Giải Thích:
> "Đây là Service-Based Architecture:
> - 4 services chạy trên 3 máy khác nhau
> - Mỗi service có database riêng
> - Giao tiếp qua REST API và Redis Pub/Sub
> - Frontend gọi đến nhiều máy"

---

## 🔥 Tips

### Nếu Cần Update Code:
```bash
# Trên mỗi máy
git pull origin main
docker-compose -f docker-compose-machineX.yml up -d --build
```

### Nếu Cần Xem Logs:
```bash
docker-compose -f docker-compose-machineX.yml logs -f
```

### Nếu Cần Restart:
```bash
docker-compose -f docker-compose-machineX.yml restart
```

### Nếu Cần Stop:
```bash
docker-compose -f docker-compose-machineX.yml down
```

---

## 🐛 Troubleshooting

### Lỗi: Cannot connect
```bash
# Tắt firewall tạm thời (macOS)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Linux
sudo ufw allow 8081/tcp
sudo ufw allow 8082/tcp
sudo ufw allow 8083/tcp
sudo ufw allow 8084/tcp
sudo ufw allow 6379/tcp
sudo ufw allow 3000/tcp
```

### Lỗi: Port already in use
```bash
# Tìm process
lsof -i :8081

# Kill process
kill -9 <PID>
```

---

## 📝 Checklist

- [ ] Đã clone project trên cả 3 máy
- [ ] Đã biết IP của 3 máy
- [ ] Đã cập nhật IP trong docker-compose files
- [ ] Đã chạy docker-compose trên cả 3 máy
- [ ] Đã test API từ máy khác
- [ ] Frontend truy cập được
- [ ] Logs đang chạy

---

## 🎯 Kiến Trúc

```
Máy 1 ([IP_1])          Máy 2 ([IP_2])          Máy 3 ([IP_3])
├─ User Service         ├─ Catalog Service      ├─ Order Service
├─ Redis                                        └─ Payment Service
└─ Frontend
```

---

**Xem chi tiết:** `DEMO_CHO_GIANG_VIEN.md`

**Chúc bạn demo thành công! 🚀**
