# 🛒 Shopping Cart API - Giải pháp đặt nhiều món

## 🎯 Vấn đề

Hiện tại frontend đang gửi **3 requests riêng biệt** khi đặt 3 món:
```
POST /orders { items: [món 1] }  → Order #12
POST /orders { items: [món 2] }  → Order #13
POST /orders { items: [món 3] }  → Order #14
```

## ✅ Giải pháp: Shopping Cart

### **Luồng mới:**
1. User thêm món vào giỏ hàng (nhiều lần)
2. User checkout 1 lần → Tạo 1 order duy nhất
3. Backend tự động xóa giỏ hàng sau khi đặt

---

## 📝 API Endpoints

### **1. Thêm món vào giỏ**
```http
POST http://localhost:8083/cart/add
Content-Type: application/json

{
  "sessionId": "user123",
  "foodItem": "Phở Bò Tái Nạm",
  "quantity": 1,
  "price": 50000,
  "subtotal": 50000
}
```

**Response:**
```json
{
  "message": "Added to cart",
  "item": {
    "id": 1,
    "sessionId": "user123",
    "foodItem": "Phở Bò Tái Nạm",
    "quantity": 1,
    "price": 50000,
    "subtotal": 50000
  }
}
```

---

### **2. Xem giỏ hàng**
```http
GET http://localhost:8083/cart/user123
```

**Response:**
```json
[
  {
    "id": 1,
    "sessionId": "user123",
    "foodItem": "Phở Bò Tái Nạm",
    "quantity": 1,
    "price": 50000,
    "subtotal": 50000
  },
  {
    "id": 2,
    "sessionId": "user123",
    "foodItem": "Bún Bò Huế",
    "quantity": 2,
    "price": 55000,
    "subtotal": 110000
  }
]
```

---

### **3. Checkout từ giỏ hàng**
```http
POST http://localhost:8083/orders/checkout-cart/user123
Content-Type: application/json

{
  "customerName": "Nguyễn Văn A",
  "paymentMethod": "COD"
}
```

**Response:**
```json
{
  "id": 15,
  "customerName": "Nguyễn Văn A",
  "items": [
    {
      "id": 1,
      "foodItem": "Phở Bò Tái Nạm",
      "quantity": 1,
      "price": 50000,
      "subtotal": 50000
    },
    {
      "id": 2,
      "foodItem": "Bún Bò Huế",
      "quantity": 2,
      "price": 55000,
      "subtotal": 110000
    }
  ],
  "totalPrice": 160000,
  "status": "ORDERED",
  "paymentMethod": "COD"
}
```

**Kết quả:**
- ✅ Chỉ tạo **1 order** (#15)
- ✅ Chứa **2 món** trong 1 order
- ✅ Giỏ hàng tự động xóa sau khi checkout
- ✅ Chỉ gửi **1 event Redis**

---

### **4. Xóa giỏ hàng (nếu cần)**
```http
DELETE http://localhost:8083/cart/user123
```

---

## 🔄 So sánh 2 cách

### **Cách cũ (Direct Order):**
```javascript
// Frontend gửi 3 requests
items.forEach(item => {
  POST /orders { items: [item] }
})
// → Tạo 3 orders riêng biệt
```

### **Cách mới (Shopping Cart):**
```javascript
// 1. Thêm vào giỏ (3 requests)
items.forEach(item => {
  POST /cart/add { sessionId, ...item }
})

// 2. Checkout 1 lần
POST /orders/checkout-cart/user123 {
  customerName, paymentMethod
}
// → Tạo 1 order duy nhất
```

---

## 🎨 Frontend Integration

### **React Example:**
```javascript
// 1. Thêm vào giỏ
const addToCart = async (item) => {
  await fetch('http://localhost:8083/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: userId, // hoặc sessionId
      foodItem: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    })
  });
};

// 2. Checkout
const checkout = async () => {
  const response = await fetch(`http://localhost:8083/orders/checkout-cart/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: userName,
      paymentMethod: 'COD'
    })
  });
  
  if (response.ok) {
    alert('Đặt hàng thành công!');
  }
};
```

---

## 📊 Database Schema

### **Table: cart_items**
```sql
CREATE TABLE cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(255),
  food_item VARCHAR(255),
  quantity INT,
  price DOUBLE,
  subtotal DOUBLE
);
```

---

## ✅ Lợi ích

- ✅ Giảm số lượng orders trong database
- ✅ Chỉ 1 event Redis thay vì nhiều
- ✅ User có thể xem/sửa giỏ hàng trước khi đặt
- ✅ Phù hợp với UX thực tế (giỏ hàng)
- ✅ Dễ dàng implement "Lưu giỏ hàng" cho lần sau

---

## 🚀 Triển khai

1. **Rebuild Order-Service:**
   ```bash
   cd Order-Service
   ./mvnw clean install
   ```

2. **Restart service** để tạo bảng `cart_items`

3. **Update Frontend** để dùng Cart API

4. **Test flow:**
   - Thêm 3 món vào cart
   - Checkout 1 lần
   - Kiểm tra chỉ tạo 1 order

Done! 🎉
