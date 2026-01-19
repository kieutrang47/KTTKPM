package iuh;

public class CreditCardPayment implements Payment {
    @Override
    public double getCost() { return 500.0; } // Giả sử giá gốc món hàng
    @Override
    public String getDescription() { return "Thanh toán qua Thẻ tín dụng"; }
}