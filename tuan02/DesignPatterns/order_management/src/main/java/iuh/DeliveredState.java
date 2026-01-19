package iuh;


public class DeliveredState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("[ĐÃ GIAO]: Đơn hàng đã hoàn tất, không làm gì thêm.");
    }

    @Override
    public void cancel(OrderContext context) {
        System.out.println("[LỖI]: Hàng đã giao rồi, không thể hủy đơn!");
    }

    @Override
    public String getStatusName() { return "ĐÃ GIAO"; }
}