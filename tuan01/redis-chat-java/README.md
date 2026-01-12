# HƯỚNG DẪN VẬN HÀNH HỆ THỐNG CHAT (JAVA + REDIS)
**Người thực hiện:** Nguyen Thi Kieu Trang
**Mô tả:** Hệ thống chat console sử dụng mô hình Pub/Sub của Redis.

---

## 1. Yêu cầu hệ thống (Prerequisites)
Trước khi chạy code Java, bạn phải đảm bảo "trái tim" của hệ thống đang đập:
* **Redis Server:** Phải đang chạy ở cổng mặc định `6379`.
* **Java JDK:** Phiên bản 8 trở lên.
* **Thư viện:** Đã nạp `jedis` vào dự án (qua Maven/Gradle).

---

## 2. Quy trình khởi chạy (Step-by-Step)

### BƯỚC 1: Khởi động Redis Server (QUAN TRỌNG NHẤT)
Logic: Redis là "bưu điện trung tâm". Nếu bưu điện đóng cửa, không ai gửi hay nhận được thư.
* **Cách làm:** Mở Terminal/CMD và gõ lệnh:
    ```bash
    redis-server
    ```
* **Kiểm tra:** Nếu thấy hình logo Redis hiện ra hoặc thông báo "Ready to accept connections" là thành công.

---

### BƯỚC 2: Chạy bên Nhận tin (Consumer)
Logic: Phải có người "ngồi trực" (Listening) trước thì khi tin nhắn đến mới nghe thấy được.
* **File:** `iuh.fit.ChatConsumer.java`
* **Hành động:** Chuột phải vào file -> chọn **Run 'ChatConsumer.main()'**.
* **Kết quả:** Màn hình Console hiện: `>>> Đang kết nối vào phòng chat 'room-1'...`.
* **Lưu ý:** Hãy giữ cửa sổ Console này mở để quan sát tin nhắn đến.

---

### BƯỚC 3: Chạy bên Gửi tin (Producer)
Logic: Đây là người dùng bước vào phòng chat.
* **File:** `iuh.fit.ChatProducer.java`
* **Hành động:** Chuột phải vào file -> chọn **Run 'ChatProducer.main()'**.
* **Kết quả:** Nhập tên của bạn (Ví dụ: `Trang`) và bắt đầu chat.

---

## 3. Mẹo kiểm thử (Testing Tips)
Để thấy sự thú vị của Real-time (Thời gian thực), hãy giả lập nhiều người dùng:

1.  Mở **1 cửa sổ** chạy `ChatConsumer` (Để nhìn toàn bộ cuộc hội thoại).
2.  Mở **2 cửa sổ khác nhau** cùng chạy `ChatProducer` (Giả lập 2 người):
    * Cửa sổ Producer 1: Nhập tên `Trang`.
    * Cửa sổ Producer 2: Nhập tên `ThayGiao`.
3.  Chat qua lại giữa 2 cửa sổ Producer và nhìn kết quả hiện ra ở cửa sổ Consumer.

---

## 4. Xử lý sự cố (Troubleshooting)
* **Lỗi "Connection refused":** Quên chưa bật Redis ở Bước 1.
* **Lỗi tiếng Việt bị lỗi font:** Do Console của IDE chưa set UTF-8.
    * *Khắc phục:* Chat tiếng Anh hoặc cấu hình lại Encoding của IDE.