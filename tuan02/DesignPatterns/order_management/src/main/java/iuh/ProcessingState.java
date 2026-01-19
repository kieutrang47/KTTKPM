package iuh;

public class ProcessingState implements OrderState {
    @Override
    public void handle(OrderContext context) {
        System.out.println(" [ĐANG XỬ LÝ]: Đã giao cho shipper. Chuyển sang ĐÃ GIAO.");
        context.setState(new DeliveredState());
    }

    @Override
    public void cancel(OrderContext context) {
        System.out.println(" [HỦY]: Đang đóng gói mà khách hủy? Thu hồi hàng ngay!");
        context.setState(new CanceledState());
    }

    @Override
    public String getStatusName() { return "ĐANG XỬ LÝ"; }
}