# Order Service API - Multiple Items Support

## 📦 Cấu trúc mới: 1 Order có nhiều món

### **Đặt 1 món (Single Item)**
```json
POST http://localhost:8083/orders
Content-Type: application/json

{
  "customerName": "Nguyễn Văn A",
  "paymentMethod": "COD",
  "items": [
    {
      "foodItem": "Bún Bò Huế Đặc Biệt",
      "quantity": 1,
      "price": 55000,
      "subtotal": 55000
    }
  ]
}
```

### **Đặt nhiều món (Multiple Items)**
```json
POST http://localhost:8083/orders
Content-Type: application/json

{
  "customerName": "Trần Thị B",
  "paymentMethod": "Banking",
  "items": [
    {
      "foodItem": "Cơm Sườn Bì Chả",
      "quantity": 2,
      "price": 45000,
      "subtotal": 90000
    },
    {
      "foodItem": "Trà Sữa Trân Châu Đường Đen",
      "quantity": 3,
      "price": 35000,
      "subtotal": 105000
    },
    {
      "foodItem": "Phở Bò Tái Nạm",
      "quantity": 1,
      "price": 50000,
      "subtotal": 50000
    }
  ]
}
```

### **Response**
```json
{
  "id": 1,
  "customerName": "Trần Thị B",
  "items": [
    {
      "id": 1,
      "foodItem": "Cơm Sườn Bì Chả",
      "quantity": 2,
      "price": 45000,
      "subtotal": 90000
    },
    {
      "id": 2,
      "foodItem": "Trà Sữa Trân Châu Đường Đen",
      "quantity": 3,
      "price": 35000,
      "subtotal": 105000
    },
    {
      "id": 3,
      "foodItem": "Phở Bò Tái Nạm",
      "quantity": 1,
      "price": 50000,
      "subtotal": 50000
    }
  ],
  "totalPrice": 245000,
  "status": "ORDERED",
  "paymentMethod": "Banking"
}
```

## 🔄 Luồng hoạt động

1. **Client gửi order** với nhiều items
2. **Order Service** tính tổng tiền tự động
3. **Lưu vào database** với quan hệ 1-N
4. **Gọi Payment Service** xử lý thanh toán
5. **Payment Service** publish event qua Redis
6. **Order Service** nhận event và update status → "PAID"

## 📊 Database Schema

### Table: orders
```sql
id | customerName | totalPrice | status | paymentMethod
1  | Trần Thị B   | 245000     | PAID   | Banking
```

### Table: order_items
```sql
id | order_id | foodItem                      | quantity | price  | subtotal
1  | 1        | Cơm Sườn Bì Chả              | 2        | 45000  | 90000
2  | 1        | Trà Sữa Trân Châu Đường Đen  | 3        | 35000  | 105000
3  | 1        | Phở Bò Tái Nạm               | 1        | 50000  | 50000
```

## ✅ Lợi ích

- ✅ 1 order có thể chứa nhiều món
- ✅ Mỗi món có số lượng riêng
- ✅ Tự động tính subtotal và totalPrice
- ✅ Dễ dàng quản lý và báo cáo
- ✅ Giảm số lượng orders trong database
- ✅ Phù hợp với thực tế đặt hàng

## 🔙 Backward Compatibility

Code vẫn hỗ trợ API cũ (1 món/order) thông qua các method `@Deprecated`:
- `getFoodItem()` → trả về món đầu tiên
- `getPrice()` → trả về totalPrice

Nhưng nên migrate sang cấu trúc mới!
