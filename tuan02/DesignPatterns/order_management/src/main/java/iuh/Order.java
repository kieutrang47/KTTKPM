package iuh;

public class Order {
    private String orderId;
    private String customerName;
    private double totalAmount;

    public Order(String id, String name, double amount) {
        this.orderId = id;
        this.customerName = name;
        this.totalAmount = amount;
    }

    // Getters
    public String getInfo() {
        return "Mã đơn: " + orderId + " | Khách: " + customerName + " | Tiền: " + totalAmount + "k";
    }
}