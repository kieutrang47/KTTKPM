# 🍕 Food Delivery - Service-Based Architecture

Hệ thống đặt món ăn sử dụng **Service-Based Architecture (SBA)** với Spring Boot và React.

---

## 🎯 Tổng Quan

### Kiến Trúc
- **4 Services độc lập**: User, Catalog, Order, Payment
- **Mỗi service có database riêng** (H2)
- **Giao tiếp REST API** + **Redis Pub/Sub**
- **Frontend React** + **Admin Dashboard**

### Tech Stack
- **Backend**: Spring Boot 3.x/4.x, H2 Database, Redis
- **Frontend**: React, Vite, TailwindCSS
- **Deployment**: Docker, Docker Compose

---

## 📦 Services

| Service | Port | Mô Tả |
|---------|------|-------|
| User Service | 8081 | Đăng ký, đăng nhập, phân quyền |
| Catalog Service | 8082 | Quản lý menu món ăn |
| Order Service | 8083 | Tạo và quản lý đơn hàng |
| Payment Service | 8084 | Xử lý thanh toán |
| Frontend | 3000 | React UI + Admin Dashboard |
| Redis | 6379 | Message broker (Pub/Sub) |

---

## 🚀 Quick Start

### 1. Deploy Local (1 Máy)

```bash
# Clone project
git clone <repository-url>
cd <project-folder>

# Chạy tất cả services
./deploy.sh start

# Hoặc
docker-compose up -d
```

**Truy cập:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

### 2. Deploy Multi-Machine (3 Máy)

**Xem hướng dẫn:** `DEPLOY_TU_GIT.md`

```bash
# Trên mỗi máy
git clone <repository-url>
cd <project-folder>

# Máy 1
docker-compose -f docker-compose-machine1.yml up -d

# Máy 2
docker-compose -f docker-compose-machine2.yml up -d

# Máy 3
docker-compose -f docker-compose-machine3.yml up -d
```

---

## 📚 Tài Liệu

### Deployment:
- **DEPLOYMENT_README.md** - Hướng dẫn deployment đầy đủ
- **DOCKER_DEPLOYMENT_GUIDE.md** - Chi tiết Docker
- **DEPLOY_TU_GIT.md** - Deploy từ Git (siêu nhanh)
- **HUONG_DAN_DEPLOY.md** - Hướng dẫn tiếng Việt

### Multi-Machine:
- **DEMO_CHO_GIANG_VIEN.md** - Hướng dẫn demo chi tiết
- **QUICK_MULTI_MACHINE_SETUP.md** - Setup nhanh
- **README_MULTI_MACHINE.md** - Tổng quan multi-machine

### Testing:
- **TEST_DEPLOYMENT.md** - Hướng dẫn test hệ thống

### Assignment:
- **BAI_TAP_GIAI_DOAN_2.md** - Tổng hợp bài tập
- **DEPLOYMENT_SUCCESS.md** - Kết quả hoàn thành

---

## 🎬 Demo Cho Giảng Viên

### Chuẩn Bị:
1. Deploy lên 3 máy khác nhau
2. Mở 3 terminals với logs
3. Mở browser với DevTools

### Kịch Bản:
1. Đăng ký user → Request đến Máy 1
2. Xem menu → Request đến Máy 2
3. Đặt hàng → Request đến Máy 3
4. Thanh toán → Request đến Máy 3 + Redis event

**Xem chi tiết:** `DEMO_CHO_GIANG_VIEN.md`

---

## 🏗️ Kiến Trúc

### Local (1 Máy):
```
┌─────────────────────────────────────────┐
│           Docker Compose                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │User  │ │Catalog│ │Order │ │Payment│ │
│  │:8081 │ │:8082 │ │:8083 │ │:8084 │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│  ┌──────┐ ┌──────────────────────────┐ │
│  │Redis │ │      Frontend :3000      │ │
│  └──────┘ └──────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Multi-Machine (3 Máy):
```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Máy 1          │   │  Máy 2          │   │  Máy 3          │
│  192.168.1.10   │   │  192.168.1.11   │   │  192.168.1.12   │
│                 │   │                 │   │                 │
│  ├─ User :8081  │   │  ├─ Catalog     │   │  ├─ Order :8083 │
│  ├─ Redis :6379 │   │  │   :8082      │   │  ├─ Payment     │
│  └─ Frontend    │   │  │              │   │  │   :8084      │
│     :3000       │   │  │              │   │  │              │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                     │                     │
         └─────────────────────┴─────────────────────┘
                        Network (LAN)
```

---

## 🔧 Quản Lý

### Xem Logs:
```bash
docker-compose logs -f
docker-compose logs -f order-service
```

### Restart Service:
```bash
docker-compose restart order-service
```

### Stop Hệ Thống:
```bash
docker-compose down
```

### Rebuild:
```bash
docker-compose up -d --build
```

---

## ✨ Tính Năng

### User:
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ Phân quyền (USER/ADMIN)

### Customer:
- ✅ Xem menu món ăn
- ✅ Thêm món vào giỏ hàng
- ✅ Đặt hàng (nhiều món/1 order)
- ✅ Thanh toán (CASH/CARD)

### Admin:
- ✅ Dashboard với thống kê
- ✅ Xem tất cả đơn hàng
- ✅ Theo dõi doanh thu
- ✅ Auto-refresh mỗi 10s

### System:
- ✅ REST API communication
- ✅ Redis Pub/Sub (Event-driven)
- ✅ Database per service
- ✅ Docker containerization
- ✅ Multi-machine deployment

---

## 🎓 Service-Based Architecture

### Đặc Điểm:
- **4-12 services** (ít hơn microservices)
- **Database per service**
- **REST API + Event-driven**
- **Đơn giản, dễ maintain**
- **Phù hợp team nhỏ**

### So Sánh Microservices:
| SBA | Microservices |
|-----|---------------|
| 4-12 services | >12 services |
| Đơn giản | Phức tạp |
| Không cần API Gateway | Cần API Gateway |
| Team nhỏ | Team lớn |

---

## 🧪 Testing

### API Testing:
```bash
# User
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123","role":"USER"}'

# Menu
curl http://localhost:8082/menu

# Order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "test",
    "items": [{"foodItem": "Pizza", "quantity": 2, "price": 150000}],
    "totalPrice": 300000,
    "paymentMethod": "CASH"
  }'
```

**Xem thêm:** `TEST_DEPLOYMENT.md`

---

## 🐛 Troubleshooting

### Port Conflict:
```bash
lsof -i :8081
kill -9 <PID>
```

### Container Issues:
```bash
docker logs <container-name>
docker restart <container-name>
```

### Network Issues:
```bash
docker network inspect food-network
docker exec order-service ping catalog-service
```

---

## 📊 Project Structure

```
.
├── User-Service/           # User management
├── Catalog-Service/        # Menu management
├── Order-Service/          # Order management
├── Payment-Service/        # Payment processing
├── frontend/               # React UI
├── docker-compose.yml      # Local deployment
├── docker-compose-machine*.yml  # Multi-machine
├── deploy.sh              # Auto deployment
└── docs/                  # Documentation
```

---

## 🤝 Contributing

1. Clone project
2. Tạo branch mới
3. Commit changes
4. Push và tạo Pull Request

---

## 📝 License

This project is for educational purposes.

---

## 🆘 Support

Nếu gặp vấn đề:
1. Xem `DEPLOYMENT_README.md`
2. Xem `TROUBLESHOOTING` section
3. Check logs: `docker-compose logs -f`

---

## 🎉 Credits

- **Architecture**: Service-Based Architecture (SBA)
- **Technologies**: Spring Boot, React, Docker, Redis
- **Purpose**: Educational project for Software Architecture course

---

**Happy Coding! 🚀**
