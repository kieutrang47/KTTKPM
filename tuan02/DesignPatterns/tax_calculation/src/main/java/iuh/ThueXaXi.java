package iuh;

public class ThueXaXi implements ThueStrategy {
    private static final double LUXURY_RATE = 0.3;

    @Override
    public double calculate(double price) {
        return price * LUXURY_RATE;
    }

    @Override
    public String getTaxType() {
        return "Special Luxury Tax (30%)";
    }
}