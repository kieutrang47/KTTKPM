package iuh;

public class ProcessingFeeDecorator extends PaymentDecorator {
    public ProcessingFeeDecorator(Payment payment) { super(payment); }

    @Override
    public double getCost() {
        return super.getCost() + 15.0; // Cộng thêm 15k phí xử lý
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " + Phí xử lý (15k)";
    }
}