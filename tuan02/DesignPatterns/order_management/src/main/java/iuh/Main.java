package iuh;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== 🛒 HỆ THỐNG QUẢN LÝ ĐƠN HÀNG MỸ PHẨM ===");

        // 1. Giả sử có một khách hàng tên Lan đặt hàng từ Database
        Order orderCuaLan = new Order("DH001", "Chị Lan", 500.0);

        // 2. Nạp dữ liệu vào bộ điều khiển (Context)
        OrderContext context = new OrderContext(orderCuaLan);

        // 3. Quy trình bắt đầu chạy
        context.proceed();

        // 4.Lan gọi điện yêu cầu hủy đơn
        context.cancel();  // Hệ thống sẽ gọi đúng logic Hủy của trạng thái hiện tại
    }
}