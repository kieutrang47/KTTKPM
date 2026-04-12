# 📦 BÀI TẬP GIAI ĐOẠN 2 - DOCKERIZE & DEPLOY

## 🎯 Yêu Cầu Đề Bài

### Giai đoạn 2 (Homework):
1. ✅ **Dockerize**: Mỗi service = 1 container
2. ✅ **docker-compose**: Chạy toàn hệ thống
3. ✅ **Deploy local server** (1 máy)
4. ✅ **Share trên nhiều máy** để chạy

---

## ✅ HOÀN THÀNH

### 1. Dockerize - Mỗi Service = 1 Container

#### Các Dockerfile đã tạo:
- ✅ `User-Service/Dockerfile` - User Service container
- ✅ `Catalog-Service/Dockerfile` - Catalog Service container
- ✅ `Order-Service/Dockerfile` - Order Service container
- ✅ `Payment-Service/Dockerfile` - Payment Service container
- ✅ `frontend/Dockerfile` - Frontend React container

#### Cấu trúc Dockerfile (Multi-stage build):
```dockerfile
# Stage 1: Build với Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime với JRE nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Lợi ích:**
- Image nhẹ (chỉ chứa JRE, không có Maven)
- Build nhanh (cache Maven dependencies)
- Bảo mật tốt hơn (ít dependencies)

---

### 2. Docker Compose - Chạy Toàn Hệ Thống

#### File docker-compose.yml
Đã tạo 2 versions:
- ✅ `docker-compose.yml` - Development version
- ✅ `docker-compose.prod.yml` - Production version (có resource limits, logging)

#### Các Services trong docker-compose:
```yaml
services:
  redis:           # Message broker
  user-service:    # Port 8081
  catalog-service: # Port 8082
  order-service:   # Port 8083
  payment-service: # Port 8084
  frontend:        # Port 3000
```

#### Features:
- ✅ Health checks cho tất cả services
- ✅ Depends_on để đảm bảo thứ tự khởi động
- ✅ Volumes để persist data
- ✅ Network riêng cho services
- ✅ Environment variables cho cấu hình
- ✅ Resource limits (production)
- ✅ Logging configuration (production)

---

### 3. Deploy Local Server (1 Máy)

#### Cách 1: Sử dụng Script (Khuyến nghị)
```bash
./deploy.sh start
```

#### Cách 2: Docker Compose trực tiếp
```bash
docker-compose up --build -d
```

#### Kết quả:
```
✓ 6 containers đang chạy:
  - food-redis (Redis)
  - user-service (Port 8081)
  - catalog-service (Port 8082)
  - order-service (Port 8083)
  - payment-service (Port 8084)
  - frontend (Port 3000)
```

#### Truy cập:
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin

---

### 4. Share Trên Nhiều Máy

#### Phương Án 1: Docker Swarm (Tự động - Khuyến nghị)

**Máy Manager:**
```bash
docker swarm init --advertise-addr <IP_MÁY_MANAGER>
docker stack deploy -c docker-compose.yml food-delivery
```

**Máy Worker:**
```bash
docker swarm join --token <TOKEN> <IP_MANAGER>:2377
```

**Kết quả:**
- Docker Swarm tự động phân bổ services lên các máy
- Load balancing tự động
- Service discovery tự động
- Scaling dễ dàng

#### Phương Án 2: Manual Deploy (Từng máy)

**Kiến trúc:**
```
Máy 1 (192.168.1.10): User Service + Redis
Máy 2 (192.168.1.11): Catalog Service
Máy 3 (192.168.1.12): Order Service
Máy 4 (192.168.1.13): Payment Service
Máy 5 (192.168.1.14): Frontend
```

**Các bước:**
1. Build image trên từng máy
2. Chạy container với environment variables chỉ đến IP các máy khác
3. Cấu hình firewall cho phép các ports
4. Test kết nối giữa các services

**Chi tiết:** Xem file `HUONG_DAN_DEPLOY.md`

---

## 📁 CÁC FILE ĐÃ TẠO

### Docker Files:
1. `docker-compose.yml` - Development configuration
2. `docker-compose.prod.yml` - Production configuration
3. `User-Service/Dockerfile`
4. `Catalog-Service/Dockerfile`
5. `Order-Service/Dockerfile`
6. `Payment-Service/Dockerfile`
7. `frontend/Dockerfile`
8. `.dockerignore` files (cho mỗi service)

### Documentation:
1. `DEPLOYMENT_README.md` - Hướng dẫn đầy đủ (English)
2. `DOCKER_DEPLOYMENT_GUIDE.md` - Chi tiết Docker deployment
3. `HUONG_DAN_DEPLOY.md` - Hướng dẫn nhanh (Tiếng Việt)
4. `BAI_TAP_GIAI_DOAN_2.md` - File này

### Scripts:
1. `deploy.sh` - Script tự động deploy

### Configuration:
1. `frontend/.env.example` - Template cho environment variables
2. Updated `application.properties` - Hỗ trợ environment variables

---

## 🚀 DEMO DEPLOY

### Deploy Local (1 máy):
```bash
# Bước 1: Clone project
git clone <repo>
cd <project>

# Bước 2: Deploy
./deploy.sh start

# Bước 3: Truy cập
open http://localhost:3000
```

**Thời gian:** ~5-10 phút (lần đầu build)

### Deploy Multi-Machine (Docker Swarm):
```bash
# Máy Manager:
docker swarm init --advertise-addr 192.168.1.10
docker stack deploy -c docker-compose.yml food-delivery

# Máy Worker (chạy trên mỗi máy):
docker swarm join --token <TOKEN> 192.168.1.10:2377

# Kiểm tra:
docker stack services food-delivery
```

**Thời gian:** ~10-15 phút

---

## 🎓 KIẾN TRÚC HỆ THỐNG

### Service-Based Architecture (SBA)

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│                      Port 3000                       │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┼────────┬────────────┬──────────────┐
    │        │        │            │              │
┌───▼───┐ ┌─▼──┐ ┌───▼────┐ ┌─────▼──────┐ ┌────▼────┐
│ User  │ │Food│ │ Order  │ │  Payment   │ │  Redis  │
│Service│ │Svc │ │Service │ │  Service   │ │  :6379  │
│ :8081 │ │8082│ │ :8083  │ │   :8084    │ └─────────┘
└───┬───┘ └─┬──┘ └───┬────┘ └─────┬──────┘
    │       │        │            │
┌───▼───────▼────────▼────────────▼──────┐
│         Docker Network (Bridge)         │
└─────────────────────────────────────────┘
```

### Đặc điểm:
- ✅ 4 services chính + 1 message broker
- ✅ Mỗi service có database riêng (H2)
- ✅ Giao tiếp REST API + Redis Pub/Sub
- ✅ Mỗi service = 1 container
- ✅ Có thể scale độc lập

---

## 📊 TESTING & VERIFICATION

### 1. Kiểm tra containers đang chạy:
```bash
docker-compose ps
```

### 2. Health checks:
```bash
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

### 3. Test API:
```bash
# Đăng ký user
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123","role":"USER"}'

# Lấy menu
curl http://localhost:8082/menu

# Tạo order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "items": [{"foodItem": "Pizza", "quantity": 2, "price": 150000}],
    "totalPrice": 300000
  }'
```

### 4. Xem logs:
```bash
docker-compose logs -f
```

### 5. Resource monitoring:
```bash
docker stats
```

---

## 🔧 TROUBLESHOOTING

### Lỗi thường gặp:

1. **Port conflict:**
   ```bash
   lsof -i :8081
   kill -9 <PID>
   ```

2. **Service không start:**
   ```bash
   docker-compose logs service-name
   ```

3. **Network issues:**
   ```bash
   docker network inspect food-network
   docker exec order-service ping catalog-service
   ```

4. **Redis connection:**
   ```bash
   docker exec -it food-redis redis-cli ping
   ```

---

## 📝 CHECKLIST NỘP BÀI

- [x] Dockerize tất cả services
- [x] Tạo docker-compose.yml
- [x] Test deploy local (1 máy)
- [x] Hướng dẫn deploy multi-machine
- [x] Documentation đầy đủ
- [x] Script tự động deploy
- [x] Health checks
- [x] Resource limits (production)
- [x] Logging configuration
- [x] .dockerignore files
- [x] Environment variables support

---

## 🎯 KẾT QUẢ ĐẠT ĐƯỢC

### Yêu cầu đề bài:
1. ✅ **Dockerize**: 5 services = 5 containers (+ Redis)
2. ✅ **docker-compose**: Chạy toàn hệ thống với 1 lệnh
3. ✅ **Deploy local**: Script `./deploy.sh start`
4. ✅ **Multi-machine**: Hỗ trợ Docker Swarm + Manual deploy

### Bonus:
- ✅ Multi-stage build để giảm image size
- ✅ Health checks tự động
- ✅ Resource limits cho production
- ✅ Logging configuration
- ✅ Auto-restart policies
- ✅ Volume persistence
- ✅ Network isolation
- ✅ Environment variables support
- ✅ Documentation đầy đủ (Tiếng Việt + English)
- ✅ Deploy script tự động

---

## 📚 TÀI LIỆU THAM KHẢO

1. **DEPLOYMENT_README.md** - Hướng dẫn đầy đủ
2. **DOCKER_DEPLOYMENT_GUIDE.md** - Chi tiết Docker
3. **HUONG_DAN_DEPLOY.md** - Hướng dẫn nhanh
4. **docker-compose.yml** - Development config
5. **docker-compose.prod.yml** - Production config

---

## 🚀 QUICK START

```bash
# Clone project
git clone <repo>
cd <project>

# Deploy
./deploy.sh start

# Truy cập
open http://localhost:3000

# Dừng
docker-compose down
```

---

**Hoàn thành 100% yêu cầu Giai đoạn 2! 🎉**

---

## 📸 SCREENSHOTS (Nên chụp để nộp bài)

1. `docker-compose ps` - Hiển thị tất cả containers đang chạy
2. `docker stats` - Resource usage
3. Frontend homepage - http://localhost:3000
4. Admin dashboard - http://localhost:3000/admin
5. Health check endpoints
6. Docker Swarm services (nếu deploy multi-machine)

---

**Ngày hoàn thành:** 12/04/2026
**Kiến trúc:** Service-Based Architecture (SBA)
**Công nghệ:** Docker, Docker Compose, Docker Swarm
