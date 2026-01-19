package iuh;

public class PayPalPayment implements Payment {
    @Override
    public double getCost() { return 500.0; }
    @Override
    public String getDescription() { return "Thanh toán qua PayPal"; }
}