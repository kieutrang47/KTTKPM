package iuh;

public interface OrderState {
    void handle(OrderContext context);
    void cancel(OrderContext context);
    String getStatusName();
}