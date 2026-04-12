# 🎓 HƯỚNG DẪN DEMO CHO GIẢNG VIÊN - SERVICE-BASED ARCHITECTURE

## 🎯 Mục Tiêu Demo

Chứng minh hệ thống là **Service-Based Architecture** bằng cách:
1. Mỗi service chạy trên **máy riêng biệt**
2. Các service **giao tiếp qua mạng** (REST API + Redis)
3. Mỗi service có **database riêng**
4. Frontend gọi đến **nhiều máy khác nhau**

---

## 📋 Chuẩn Bị

### Yêu Cầu:
- **3 máy** trong cùng mạng LAN (hoặc 2 máy + 1 máy chính)
- Mỗi máy cài Docker
- Biết IP của từng máy

### Kiến Trúc Demo:

```
┌─────────────────────────────────────────────────────────┐
│  Máy 1 (192.168.1.10) - Máy Chính                       │
│  - User Service (8081)                                   │
│  - Redis (6379)                                          │
│  - Frontend (3000)                                       │
└─────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │                       │
┌───────▼──────────┐   ┌────────▼─────────┐
│  Máy 2           │   │  Máy 3           │
│  (192.168.1.11)  │   │  (192.168.1.12)  │
│                  │   │                  │
│  - Catalog Svc   │   │  - Order Svc     │
│    (8082)        │   │    (8083)        │
│                  │   │  - Payment Svc   │
│                  │   │    (8084)        │
└──────────────────┘   └──────────────────┘
```

---

## 🚀 BƯỚC 1: Clone Project Từ Git

### Trên mỗi máy (Máy 1, 2, 3):

```bash
# Clone repository
git clone <repository-url>
cd <project-folder>

# Hoặc nếu đã có, pull code mới nhất
git pull origin main
```

---

## 🚀 BƯỚC 2: Kiểm Tra IP Các Máy

### Trên mỗi máy, chạy:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

**Ghi lại IP:**
- Máy 1 (chính): `192.168.x.x` → Ví dụ: 192.168.1.10
- Máy 2: `192.168.x.x` → Ví dụ: 192.168.1.11
- Máy 3: `192.168.x.x` → Ví dụ: 192.168.1.12

---

## 🚀 BƯỚC 3: Deploy Máy 1 (User Service + Redis + Frontend)

### 2.1. Đảm Bảo Đã Clone Project

```bash
# Nếu chưa clone
git clone <repository-url>
cd <project-folder>
```

### 2.2. Tạo docker-compose-machine1.yml

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: food-redis
    ports:
      - "6379:6379"
    networks:
      - food-network
    restart: unless-stopped

  user-service:
    build:
      context: ./User-Service
      dockerfile: Dockerfile
    container_name: user-service
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:file:/data/user_sba_db;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
    volumes:
      - user-data:/data
    networks:
      - food-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "3000:80"
    environment:
      - VITE_USER_API_URL=http://192.168.1.10:8081/users
      - VITE_CATALOG_API_URL=http://192.168.1.11:8082/menu
      - VITE_ORDER_API_URL=http://192.168.1.12:8083/orders
      - VITE_PAYMENT_API_URL=http://192.168.1.12:8084/payments
    networks:
      - food-network
    restart: unless-stopped

networks:
  food-network:
    driver: bridge

volumes:
  user-data:
```

### 2.3. Chạy trên Máy 1

```bash
docker-compose -f docker-compose-machine1.yml up -d
```

---

## 🚀 BƯỚC 4: Deploy Máy 2 (Catalog Service)

### 3.1. Đảm Bảo Đã Clone Project

```bash
# Nếu chưa clone
git clone <repository-url>
cd <project-folder>
```

### 3.2. Tạo docker-compose-machine2.yml

```yaml
version: '3.8'

services:
  catalog-service:
    build:
      context: ./Catalog-Service
      dockerfile: Dockerfile
    container_name: catalog-service
    ports:
      - "8082:8082"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:file:/data/food_sba_db;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
    volumes:
      - catalog-data:/data
    restart: unless-stopped

volumes:
  catalog-data:
```

### 3.3. Chạy trên Máy 2

```bash
docker-compose -f docker-compose-machine2.yml up -d
```

---

## 🚀 BƯỚC 5: Deploy Máy 3 (Order + Payment Service)

### 4.1. Đảm Bảo Đã Clone Project

```bash
# Nếu chưa clone
git clone <repository-url>
cd <project-folder>
```

### 4.2. Tạo docker-compose-machine3.yml

```yaml
version: '3.8'

services:
  order-service:
    build:
      context: ./Order-Service
      dockerfile: Dockerfile
    container_name: order-service
    ports:
      - "8083:8083"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:file:/data/order_sba_db;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
      - SPRING_DATA_REDIS_HOST=192.168.1.10
      - SPRING_DATA_REDIS_PORT=6379
      - FOOD_SERVICE_URL=http://192.168.1.11:8082
      - USER_SERVICE_URL=http://192.168.1.10:8081
      - PAYMENT_SERVICE_URL=http://192.168.1.12:8084
    volumes:
      - order-data:/data
    restart: unless-stopped

  payment-service:
    build:
      context: ./Payment-Service
      dockerfile: Dockerfile
    container_name: payment-service
    ports:
      - "8084:8084"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:file:/data/payment_sba_db;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1
      - SPRING_DATA_REDIS_HOST=192.168.1.10
      - SPRING_DATA_REDIS_PORT=6379
      - ORDER_SERVICE_URL=http://192.168.1.12:8083
    volumes:
      - payment-data:/data
    restart: unless-stopped

volumes:
  order-data:
  payment-data:
```

### 4.3. Chạy trên Máy 3

```bash
docker-compose -f docker-compose-machine3.yml up -d
```

---

## 🚀 BƯỚC 6: Cấu Hình Firewall (Quan Trọng!)

### Trên mỗi máy, cho phép các ports:

**macOS:**
```bash
# Tắt firewall tạm thời (để demo)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

**Linux (Ubuntu):**
```bash
sudo ufw allow 8081/tcp
sudo ufw allow 8082/tcp
sudo ufw allow 8083/tcp
sudo ufw allow 8084/tcp
sudo ufw allow 6379/tcp
sudo ufw allow 3000/tcp
```

**Windows:**
```powershell
# Mở Windows Defender Firewall
# Add Inbound Rules cho ports: 8081-8084, 6379, 3000
```

---

## 🧪 BƯỚC 7: Test Kết Nối Giữa Các Máy

### Từ Máy 1, test các máy khác:

```bash
# Test Máy 2 (Catalog Service)
curl http://192.168.1.11:8082/menu

# Test Máy 3 (Order Service)
curl http://192.168.1.12:8083/orders

# Test Máy 3 (Payment Service)
curl http://192.168.1.12:8084/payments
```

### Từ Máy 3, test Redis trên Máy 1:

```bash
docker exec order-service nc -zv 192.168.1.10 6379
```

**Nếu tất cả OK → Tiếp tục**

---

## 🎬 BƯỚC 8: DEMO CHO GIẢNG VIÊN

### 7.1. Chuẩn Bị Demo

**Mở 3 terminals (hoặc 3 màn hình):**

**Terminal 1 - Máy 1:**
```bash
docker logs -f user-service
```

**Terminal 2 - Máy 2:**
```bash
docker logs -f catalog-service
```

**Terminal 3 - Máy 3:**
```bash
docker logs -f order-service
```

### 7.2. Kịch Bản Demo

#### Bước 1: Giới Thiệu Kiến Trúc

**Nói:**
> "Em xin demo hệ thống Service-Based Architecture với 4 services độc lập:
> - Máy 1: User Service + Redis + Frontend
> - Máy 2: Catalog Service  
> - Máy 3: Order Service + Payment Service
> 
> Mỗi service có database riêng (H2), giao tiếp qua REST API và Redis Pub/Sub"

**Chỉ vào màn hình:**
- Máy 1: `docker ps` → Thấy user-service, redis, frontend
- Máy 2: `docker ps` → Thấy catalog-service
- Máy 3: `docker ps` → Thấy order-service, payment-service

#### Bước 2: Demo Frontend Gọi Nhiều Máy

**Mở browser:**
```
http://192.168.1.10:3000
```

**Nói:**
> "Frontend đang chạy trên Máy 1, nhưng sẽ gọi API từ 3 máy khác nhau"

**Mở DevTools (F12) → Network tab**

**Thực hiện:**
1. Đăng ký user → Thấy request đến `192.168.1.10:8081` (Máy 1)
2. Xem menu → Thấy request đến `192.168.1.11:8082` (Máy 2)
3. Đặt hàng → Thấy request đến `192.168.1.12:8083` (Máy 3)
4. Thanh toán → Thấy request đến `192.168.1.12:8084` (Máy 3)

**Chỉ vào logs:**
- Terminal 1: User Service nhận request login
- Terminal 2: Catalog Service nhận request menu
- Terminal 3: Order Service nhận request create order

#### Bước 3: Demo Redis Pub/Sub (Event-Driven)

**Nói:**
> "Khi thanh toán, Payment Service (Máy 3) sẽ gửi event qua Redis (Máy 1), 
> Order Service (Máy 3) lắng nghe và tự động cập nhật trạng thái"

**Thực hiện:**
1. Tạo order → Xem logs Order Service: "Order created"
2. Thanh toán → Xem logs:
   - Payment Service: "Gửi sự kiện Redis"
   - Order Service: "🎯 Nhận Event từ Redis" → "✅ Cập nhật Order"

**Chỉ vào:**
> "Đây là Event-Driven Architecture, services không gọi trực tiếp nhau 
> mà giao tiếp qua message broker (Redis)"

#### Bước 4: Demo Database Độc Lập

**Nói:**
> "Mỗi service có database riêng, thể hiện tính độc lập"

**Chạy:**
```bash
# Máy 1
docker exec user-service ls -la /data/
# → Thấy user_sba_db.mv.db

# Máy 2
docker exec catalog-service ls -la /data/
# → Thấy food_sba_db.mv.db

# Máy 3
docker exec order-service ls -la /data/
# → Thấy order_sba_db.mv.db

docker exec payment-service ls -la /data/
# → Thấy payment_sba_db.mv.db
```

#### Bước 5: Demo Tính Phân Tán

**Nói:**
> "Nếu 1 service down, các service khác vẫn hoạt động"

**Thực hiện:**
```bash
# Máy 2: Stop Catalog Service
docker stop catalog-service
```

**Test:**
- Đăng nhập vẫn OK (User Service trên Máy 1)
- Xem menu → Lỗi (Catalog Service down)
- Đặt hàng vẫn OK (Order Service trên Máy 3)

**Restart:**
```bash
docker start catalog-service
```

**Nói:**
> "Service đã phục hồi, hệ thống tiếp tục hoạt động bình thường"

---

## 📊 BƯỚC 9: Tạo Slide/Diagram Cho Giảng Viên

### Diagram 1: Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                  Máy 1: 192.168.1.10:3000               │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────┼────────┬────────────┬──────────────┐
    │        │        │            │              │
┌───▼───┐ ┌─▼──┐ ┌───▼────┐ ┌─────▼──────┐ ┌────▼────┐
│ User  │ │Food│ │ Order  │ │  Payment   │ │  Redis  │
│Service│ │Svc │ │Service │ │  Service   │ │  :6379  │
│ :8081 │ │8082│ │ :8083  │ │   :8084    │ │         │
│ Máy 1 │ │Máy2│ │ Máy 3  │ │   Máy 3    │ │  Máy 1  │
└───┬───┘ └─┬──┘ └───┬────┘ └─────┬──────┘ └─────────┘
    │       │        │            │
┌───▼───────▼────────▼────────────▼──────┐
│         Network (LAN/Internet)          │
└─────────────────────────────────────────┘
```

### Diagram 2: Flow Đặt Hàng

```
1. User → Frontend (Máy 1)
2. Frontend → Catalog Service (Máy 2) [GET /menu]
3. Frontend → Order Service (Máy 3) [POST /orders]
4. Frontend → Payment Service (Máy 3) [POST /payments]
5. Payment Service → Redis (Máy 1) [PUBLISH event]
6. Order Service ← Redis (Máy 1) [SUBSCRIBE event]
7. Order Service → Update database
```

---

## 📝 BƯỚC 10: Checklist Demo

- [ ] 3 máy đã cài Docker
- [ ] Biết IP của từng máy
- [ ] Firewall đã mở ports
- [ ] Services đã deploy lên từng máy
- [ ] Test kết nối giữa các máy thành công
- [ ] Frontend truy cập được từ browser
- [ ] Logs đang chạy trên 3 terminals
- [ ] DevTools browser đã mở Network tab
- [ ] Đã test flow đầy đủ: Đăng ký → Menu → Order → Payment

---

## 🎯 ĐIỂM NHẤN KHI DEMO

### 1. Service-Based Architecture (SBA)
- ✅ 4 services độc lập
- ✅ Mỗi service có database riêng
- ✅ Giao tiếp REST API
- ✅ Event-driven (Redis Pub/Sub)

### 2. Tính Phân Tán
- ✅ Services chạy trên máy khác nhau
- ✅ Giao tiếp qua mạng
- ✅ Có thể scale độc lập

### 3. Khác Microservices
- SBA: 4-12 services (ít hơn)
- SBA: Đơn giản hơn, dễ maintain
- SBA: Không cần API Gateway, Service Mesh
- SBA: Phù hợp team nhỏ, dự án vừa

---

## 🆘 Troubleshooting

### Lỗi: Cannot connect to service

```bash
# Kiểm tra firewall
sudo ufw status

# Kiểm tra service đang chạy
docker ps

# Test connectivity
curl http://<IP>:<PORT>
```

### Lỗi: Redis connection failed

```bash
# Kiểm tra Redis
docker exec -it food-redis redis-cli ping

# Test từ máy khác
telnet 192.168.1.10 6379
```

### Lỗi: Frontend không load

```bash
# Kiểm tra environment variables
docker exec frontend env | grep VITE

# Rebuild frontend với IP đúng
docker-compose up -d --build frontend
```

---

## 📸 Screenshots Nên Chụp

1. `docker ps` trên cả 3 máy
2. Browser DevTools → Network tab (thấy requests đến nhiều IP)
3. Logs của 3 services khi có request
4. Redis event trong logs
5. Admin dashboard với statistics

---

**Chúc bạn demo thành công! 🎓🚀**
