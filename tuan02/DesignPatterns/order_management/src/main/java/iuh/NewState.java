package iuh;

public class NewState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println(" [MỚI TẠO]: Check kho xong. Chuyển sang ĐÓNG GÓI.");
        context.setState(new ProcessingState());
    }

    @Override
    public void cancel(OrderContext context) {
        System.out.println(" [HỦY]: Đã hủy đơn hàng ngay lập tức.");
        context.setState(new CanceledState());
    }

    @Override
    public String getStatusName() { return "MỚI TẠO"; }
}