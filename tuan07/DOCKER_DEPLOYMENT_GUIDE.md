# 🐳 Hướng Dẫn Dockerize và Deploy Hệ Thống Food Delivery SBA

## 📋 Mục Lục
1. [Chuẩn Bị](#chuẩn-bị)
2. [Deploy Local (1 Máy)](#deploy-local-1-máy)
3. [Deploy Multi-Machine (Nhiều Máy)](#deploy-multi-machine-nhiều-máy)
4. [Troubleshooting](#troubleshooting)

---

## 🔧 Chuẩn Bị

### Yêu Cầu Hệ Thống
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **Disk**: Tối thiểu 5GB trống

### Kiểm Tra Docker
```bash
docker --version
docker-compose --version
```

### Cấu Trúc Project
```
.
├── User-Service/
│   ├── Dockerfile
│   └── src/
├── Catalog-Service/
│   ├── Dockerfile
│   └── src/
├── Order-Service/
│   ├── Dockerfile
│   └── src/
├── Payment-Service/
│   ├── Dockerfile
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
└── docker-compose.yml
```

---

## 🏠 Deploy Local (1 Máy)

### Bước 1: Build và Chạy Toàn Bộ Hệ Thống

```bash
# Từ thư mục root của project
docker-compose up --build
```

**Giải thích:**
- `--build`: Build lại images từ Dockerfile
- Lần đầu sẽ mất 5-10 phút để build

### Bước 2: Chạy Ở Background (Detached Mode)

```bash
docker-compose up -d
```

### Bước 3: Kiểm Tra Services Đang Chạy

```bash
docker-compose ps
```

**Kết quả mong đợi:**
```
NAME                IMAGE                    STATUS         PORTS
user-service        user-service            Up             0.0.0.0:8081->8081/tcp
catalog-service     catalog-service         Up             0.0.0.0:8082->8082/tcp
order-service       order-service           Up             0.0.0.0:8083->8083/tcp
payment-service     payment-service         Up             0.0.0.0:8084->8084/tcp
frontend            frontend                Up             0.0.0.0:3000->80/tcp
food-redis          redis:7-alpine          Up             0.0.0.0:6379->6379/tcp
```

### Bước 4: Truy Cập Ứng Dụng

- **Frontend**: http://localhost:3000
- **User Service**: http://localhost:8081
- **Catalog Service**: http://localhost:8082
- **Order Service**: http://localhost:8083
- **Payment Service**: http://localhost:8084

### Bước 5: Xem Logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs 1 service cụ thể
docker-compose logs -f order-service
```

### Bước 6: Dừng Hệ Thống

```bash
# Dừng nhưng giữ data
docker-compose stop

# Dừng và xóa containers (giữ volumes/data)
docker-compose down

# Dừng và xóa tất cả (bao gồm volumes/data)
docker-compose down -v
```

---

## 🌐 Deploy Multi-Machine (Nhiều Máy)

### Kiến Trúc Phân Tán

```
Máy 1 (192.168.1.10): User-Service + Redis
Máy 2 (192.168.1.11): Catalog-Service
Máy 3 (192.168.1.12): Order-Service
Máy 4 (192.168.1.13): Payment-Service
Máy 5 (192.168.1.14): Frontend
```

### Phương Án 1: Docker Swarm (Khuyến Nghị)

#### Bước 1: Khởi Tạo Swarm Manager (Máy 1)

```bash
# Trên máy 1 (Manager)
docker swarm init --advertise-addr 192.168.1.10
```

**Output sẽ cho token để join:**
```
docker swarm join --token SWMTKN-1-xxx... 192.168.1.10:2377
```

#### Bước 2: Join Worker Nodes (Máy 2, 3, 4, 5)

```bash
# Chạy lệnh này trên mỗi máy worker
docker swarm join --token SWMTKN-1-xxx... 192.168.1.10:2377
```

#### Bước 3: Tạo Overlay Network

```bash
# Trên Manager
docker network create --driver overlay --attachable food-network
```

#### Bước 4: Deploy Stack

```bash
# Trên Manager, từ thư mục chứa docker-compose.yml
docker stack deploy -c docker-compose.yml food-delivery
```

#### Bước 5: Kiểm Tra Services

```bash
docker stack services food-delivery
docker stack ps food-delivery
```

#### Bước 6: Scale Services (Nếu Cần)

```bash
# Scale order-service lên 3 replicas
docker service scale food-delivery_order-service=3
```

---

### Phương Án 2: Chạy Riêng Từng Service (Manual)

#### Máy 1: User-Service + Redis

```bash
# Tạo network
docker network create food-network

# Chạy Redis
docker run -d \
  --name food-redis \
  --network food-network \
  -p 6379:6379 \
  redis:7-alpine

# Build và chạy User-Service
cd User-Service
docker build -t user-service .
docker run -d \
  --name user-service \
  --network food-network \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL=jdbc:h2:file:/data/user_sba_db \
  -v user-data:/data \
  user-service
```

#### Máy 2: Catalog-Service

```bash
cd Catalog-Service
docker build -t catalog-service .
docker run -d \
  --name catalog-service \
  -p 8082:8082 \
  -e SPRING_DATASOURCE_URL=jdbc:h2:file:/data/food_sba_db \
  -v catalog-data:/data \
  catalog-service
```

#### Máy 3: Order-Service

```bash
cd Order-Service
docker build -t order-service .
docker run -d \
  --name order-service \
  -p 8083:8083 \
  -e SPRING_DATASOURCE_URL=jdbc:h2:file:/data/order_sba_db \
  -e SPRING_DATA_REDIS_HOST=192.168.1.10 \
  -e FOOD_SERVICE_URL=http://192.168.1.11:8082 \
  -e USER_SERVICE_URL=http://192.168.1.10:8081 \
  -e PAYMENT_SERVICE_URL=http://192.168.1.13:8084 \
  -v order-data:/data \
  order-service
```

#### Máy 4: Payment-Service

```bash
cd Payment-Service
docker build -t payment-service .
docker run -d \
  --name payment-service \
  -p 8084:8084 \
  -e SPRING_DATASOURCE_URL=jdbc:h2:file:/data/payment_sba_db \
  -e ORDER_SERVICE_URL=http://192.168.1.12:8083 \
  -v payment-data:/data \
  payment-service
```

#### Máy 5: Frontend

**Cập nhật file `.env` trong frontend:**
```bash
VITE_USER_API_URL=http://192.168.1.10:8081/users
VITE_CATALOG_API_URL=http://192.168.1.11:8082/menu
VITE_ORDER_API_URL=http://192.168.1.12:8083/orders
VITE_PAYMENT_API_URL=http://192.168.1.13:8084/payments
```

**Build và chạy:**
```bash
cd frontend
docker build -t frontend .
docker run -d \
  --name frontend \
  -p 3000:80 \
  frontend
```

---

### Phương Án 3: Docker Compose với Remote Context

#### Bước 1: Cấu Hình SSH cho Docker

```bash
# Trên mỗi máy, enable Docker remote API
sudo systemctl edit docker.service

# Thêm vào:
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375

# Restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### Bước 2: Tạo Docker Context

```bash
# Từ máy điều khiển
docker context create machine1 --docker "host=tcp://192.168.1.10:2375"
docker context create machine2 --docker "host=tcp://192.168.1.11:2375"
docker context create machine3 --docker "host=tcp://192.168.1.12:2375"
docker context create machine4 --docker "host=tcp://192.168.1.13:2375"
docker context create machine5 --docker "host=tcp://192.168.1.14:2375"
```

#### Bước 3: Deploy Từng Service

```bash
# User-Service lên máy 1
docker context use machine1
docker-compose up -d user-service redis

# Catalog-Service lên máy 2
docker context use machine2
docker-compose up -d catalog-service

# Order-Service lên máy 3
docker context use machine3
docker-compose up -d order-service

# Payment-Service lên máy 4
docker context use machine4
docker-compose up -d payment-service

# Frontend lên máy 5
docker context use machine5
docker-compose up -d frontend
```

---

## 🔍 Troubleshooting

### 1. Container Không Start

```bash
# Xem logs chi tiết
docker-compose logs service-name

# Kiểm tra health status
docker inspect --format='{{.State.Health.Status}}' container-name
```

### 2. Services Không Kết Nối Được

```bash
# Kiểm tra network
docker network inspect food-network

# Test connectivity giữa containers
docker exec order-service ping catalog-service
```

### 3. Port Đã Được Sử Dụng

```bash
# Tìm process đang dùng port
sudo lsof -i :8081

# Kill process
sudo kill -9 <PID>
```

### 4. Out of Memory

```bash
# Giới hạn memory cho service trong docker-compose.yml
services:
  order-service:
    mem_limit: 512m
    mem_reservation: 256m
```

### 5. Redis Connection Failed

```bash
# Kiểm tra Redis đang chạy
docker exec -it food-redis redis-cli ping

# Xem Redis logs
docker logs food-redis
```

### 6. Database Bị Mất Sau Khi Restart

```bash
# Đảm bảo volumes được mount đúng
docker volume ls
docker volume inspect order-data
```

---

## 📊 Monitoring

### Xem Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats order-service
```

### Health Check

```bash
# Check tất cả services
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

---

## 🎯 Best Practices

1. **Luôn sử dụng volumes** cho database để tránh mất data
2. **Set memory limits** để tránh 1 service chiếm hết RAM
3. **Sử dụng health checks** để Docker tự restart service lỗi
4. **Log rotation** để tránh logs chiếm hết disk
5. **Backup volumes** định kỳ

---

## 📝 Checklist Deploy

- [ ] Docker và Docker Compose đã cài đặt
- [ ] Tất cả Dockerfile đã có
- [ ] docker-compose.yml đã cấu hình đúng
- [ ] Ports không bị conflict
- [ ] Network giữa các máy thông nhau (nếu multi-machine)
- [ ] Firewall cho phép các ports cần thiết
- [ ] Đã test kết nối giữa các services
- [ ] Đã backup data trước khi deploy production

---

## 🚀 Quick Commands

```bash
# Start tất cả
docker-compose up -d

# Stop tất cả
docker-compose down

# Restart 1 service
docker-compose restart order-service

# Rebuild 1 service
docker-compose up -d --build order-service

# Xem logs real-time
docker-compose logs -f

# Clean up tất cả
docker-compose down -v
docker system prune -a
```

---

**Chúc bạn deploy thành công! 🎉**
