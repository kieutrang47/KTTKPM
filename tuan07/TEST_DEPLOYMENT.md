# 🧪 Test Deployment - Food Delivery SBA

## ✅ Kiểm Tra Hệ Thống Đã Deploy

### 1. Kiểm Tra Containers Đang Chạy

```bash
docker-compose ps
```

**Kết quả mong đợi:** 6 containers đang UP
- food-redis (healthy)
- user-service (running)
- catalog-service (running)
- order-service (running)
- payment-service (running)
- frontend (running)

---

### 2. Kiểm Tra Health của Services

```bash
# User Service
curl http://localhost:8081/actuator/health

# Catalog Service  
curl http://localhost:8082/actuator/health

# Order Service
curl http://localhost:8083/actuator/health

# Payment Service
curl http://localhost:8084/actuator/health
```

**Kết quả mong đợi:** Tất cả trả về `{"status":"UP"}`

---

### 3. Test API Endpoints

#### 3.1. Đăng Ký User

```bash
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456",
    "role": "USER"
  }'
```

**Kết quả:** User được tạo thành công

#### 3.2. Đăng Nhập

```bash
curl -X POST http://localhost:8081/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

**Kết quả:** Trả về thông tin user với role

#### 3.3. Lấy Menu

```bash
curl http://localhost:8082/menu
```

**Kết quả:** Danh sách món ăn (Pizza, Burger, Pasta, Salad, Sushi)

#### 3.4. Tạo Order

```bash
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "testuser",
    "items": [
      {
        "foodItem": "Pizza",
        "quantity": 2,
        "price": 150000
      },
      {
        "foodItem": "Burger",
        "quantity": 1,
        "price": 80000
      }
    ],
    "totalPrice": 380000,
    "paymentMethod": "CASH"
  }'
```

**Kết quả:** Order được tạo với ID

#### 3.5. Thanh Toán Order

```bash
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "customerName": "testuser",
    "items": [
      {
        "foodItem": "Pizza",
        "quantity": 2,
        "price": 150000
      }
    ],
    "totalPrice": 300000,
    "status": "ORDERED",
    "paymentMethod": "CASH"
  }'
```

**Kết quả:** Payment thành công, Redis event được gửi

#### 3.6. Kiểm Tra Order Đã Cập Nhật

```bash
curl http://localhost:8083/orders/1
```

**Kết quả:** Order status = "PAID" (đã được cập nhật qua Redis)

---

### 4. Test Frontend

#### 4.1. Truy Cập Frontend

```bash
open http://localhost:3000
```

**Hoặc:** Mở browser và vào http://localhost:3000

#### 4.2. Test Flow Đầy Đủ

1. **Đăng ký tài khoản mới**
   - Click "Sign In" → "Chưa có tài khoản? Đăng ký ngay"
   - Nhập username, password
   - Click "Đăng Ký Ngay"

2. **Đăng nhập**
   - Nhập username, password
   - Click "Vào Hệ Thống"

3. **Xem menu và thêm vào giỏ**
   - Xem danh sách món ăn
   - Click "Add to Cart" cho các món
   - Kiểm tra số lượng trong Cart badge

4. **Đặt hàng**
   - Click "Cart"
   - Xem lại các món đã chọn
   - Click "Place Order"
   - Nhập tên khách hàng
   - Chọn phương thức thanh toán
   - Click "Confirm Order"

5. **Thanh toán**
   - Sau khi đặt hàng, click "Pay Now"
   - Xác nhận thanh toán

6. **Kiểm tra Admin Dashboard** (nếu có tài khoản admin)
   - Đăng nhập với role ADMIN
   - Tự động redirect đến /admin
   - Xem thống kê: Tổng đơn, Đã thanh toán, Đang xử lý, Doanh thu
   - Xem danh sách orders với chi tiết

---

### 5. Test Redis Pub/Sub

#### 5.1. Monitor Redis Events

Terminal 1 - Subscribe to Redis channel:
```bash
docker exec -it food-redis redis-cli
SUBSCRIBE order-payment-channel
```

Terminal 2 - Tạo payment:
```bash
curl -X POST http://localhost:8084/payments \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "customerName": "test",
    "items": [{"foodItem": "Pizza", "quantity": 1, "price": 150000}],
    "totalPrice": 150000,
    "status": "ORDERED",
    "paymentMethod": "CASH"
  }'
```

**Kết quả Terminal 1:** Nhận được message từ Redis channel

#### 5.2. Kiểm Tra Order Service Nhận Event

```bash
docker logs order-service --tail 20
```

**Kết quả:** Log hiển thị "🎯 Order Service nhận Event từ Redis" và "✅ Đã cập nhật Order"

---

### 6. Xem Logs Real-time

```bash
# Tất cả services
docker-compose logs -f

# 1 service cụ thể
docker-compose logs -f payment-service

# Chỉ xem 50 dòng cuối
docker-compose logs --tail=50 order-service
```

---

### 7. Kiểm Tra Resource Usage

```bash
docker stats
```

**Kết quả:** Hiển thị CPU, Memory usage của từng container

---

### 8. Test Network Connectivity

```bash
# Test từ Order Service đến Catalog Service
docker exec order-service ping -c 3 catalog-service

# Test từ Payment Service đến Redis
docker exec payment-service nc -zv redis 6379

# Test từ Order Service đến Redis
docker exec order-service nc -zv redis 6379
```

**Kết quả:** Tất cả kết nối thành công

---

### 9. Test Database Persistence

#### 9.1. Tạo dữ liệu

```bash
# Tạo user
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"persistent","password":"123","role":"USER"}'

# Tạo order
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "persistent",
    "items": [{"foodItem": "Pizza", "quantity": 1, "price": 150000}],
    "totalPrice": 150000,
    "paymentMethod": "CASH"
  }'
```

#### 9.2. Restart Services

```bash
docker-compose restart user-service order-service
```

#### 9.3. Kiểm Tra Dữ Liệu Vẫn Còn

```bash
# Login với user vừa tạo
curl -X POST http://localhost:8081/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"persistent","password":"123"}'

# Lấy orders
curl http://localhost:8083/orders
```

**Kết quả:** Dữ liệu vẫn còn (nhờ volumes)

---

### 10. Test Error Handling

#### 10.1. Test với Invalid Data

```bash
# Order không có items
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "test",
    "items": [],
    "totalPrice": 0
  }'
```

**Kết quả:** Error 400 - "Order must have at least one item"

#### 10.2. Test với Missing Fields

```bash
# Order không có customer name
curl -X POST http://localhost:8083/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"foodItem": "Pizza", "quantity": 1, "price": 150000}],
    "totalPrice": 150000
  }'
```

**Kết quả:** Error 400 - "Customer name is required"

---

## 🎯 Checklist Test Deployment

- [ ] Tất cả containers đang chạy
- [ ] Health checks pass
- [ ] User registration hoạt động
- [ ] User login hoạt động
- [ ] Menu API trả về dữ liệu
- [ ] Tạo order thành công
- [ ] Payment thành công
- [ ] Redis Pub/Sub hoạt động (Order status cập nhật từ ORDERED → PAID)
- [ ] Frontend hiển thị đúng
- [ ] Admin dashboard hiển thị thống kê
- [ ] Database persistence (data không mất sau restart)
- [ ] Network connectivity giữa services
- [ ] Error handling đúng

---

## 🐛 Troubleshooting

### Lỗi: Port already in use

```bash
# Tìm process đang dùng port
lsof -i :8081

# Kill process
kill -9 <PID>
```

### Lỗi: Container unhealthy

```bash
# Xem logs
docker logs <container-name>

# Restart container
docker-compose restart <service-name>
```

### Lỗi: Redis connection failed

```bash
# Kiểm tra Redis đang chạy
docker exec -it food-redis redis-cli ping

# Kiểm tra network
docker network inspect tuan07_food-network

# Test connectivity
docker exec payment-service nc -zv redis 6379
```

### Lỗi: Cannot connect to service

```bash
# Kiểm tra service đang chạy
docker-compose ps

# Kiểm tra logs
docker-compose logs <service-name>

# Restart service
docker-compose restart <service-name>
```

---

## 📊 Expected Results Summary

| Test | Expected Result |
|------|----------------|
| Containers Status | 6/6 UP |
| Health Checks | All UP |
| User Registration | Success |
| User Login | Returns user object |
| Menu API | Returns 5 items |
| Create Order | Returns order with ID |
| Payment | Success + Redis event |
| Order Status Update | ORDERED → PAID |
| Frontend | Loads successfully |
| Admin Dashboard | Shows statistics |
| Database Persistence | Data survives restart |
| Redis Pub/Sub | Events delivered |

---

**Nếu tất cả tests pass → Deployment thành công! 🎉**
