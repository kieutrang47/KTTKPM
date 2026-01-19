package iuh;

public class ThueVAT implements ThueStrategy {
    private static final double VAT_RATE = 0.1;

    @Override
    public double calculate(double price) {
        return price * VAT_RATE;
    }

    @Override
    public String getTaxType() {
        return "Value Added Tax (10%)";
    }
}