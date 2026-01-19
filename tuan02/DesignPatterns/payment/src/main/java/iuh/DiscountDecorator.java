package iuh;

public class DiscountDecorator extends PaymentDecorator {
    public DiscountDecorator(Payment payment) { super(payment); }

    @Override
    public double getCost() {
        return super.getCost() - 50.0; // Giảm 50k
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " - Mã giảm giá (50k)";
    }
}