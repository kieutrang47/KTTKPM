package iuh;


public class CanceledState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println("[HỦY]: Đơn đã hủy, không thể xử lý tiếp.");
    }

    @Override
    public void cancel(OrderContext context) {
        System.out.println("[HỦY]: Đơn này hủy rồi đệ tử ơi!");
    }

    @Override
    public String getStatusName() { return "ĐÃ HỦY"; }
}
