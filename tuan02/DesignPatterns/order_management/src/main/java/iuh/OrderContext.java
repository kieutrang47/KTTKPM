package iuh;

public class OrderContext {
    private OrderState state;
    private Order orderData; // Dữ liệu thật nằm ở đây nè!

    public OrderContext(Order data) {
        this.orderData = data;
        this.state = new NewState(); // Vừa đẻ ra là trạng thái Mới
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public void proceed() {
        System.out.println("--- Đang xử lý: " + orderData.getInfo() + " ---");
        state.handle(this);
    }

    public void cancel() {
        System.out.println("--- Đang yêu cầu hủy: " + orderData.getInfo() + " ---");
        state.cancel(this);
    }
}