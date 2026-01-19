package iuh;

public abstract class PaymentDecorator implements Payment {
    protected Payment decoratedPayment; // Tham chiếu đến đối tượng bị bao bọc

    public PaymentDecorator(Payment payment) {
        this.decoratedPayment = payment;
    }

    @Override
    public double getCost() { return decoratedPayment.getCost(); }

    @Override
    public String getDescription() { return decoratedPayment.getDescription(); }
}