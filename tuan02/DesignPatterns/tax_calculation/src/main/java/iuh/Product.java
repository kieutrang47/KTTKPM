package iuh;

public class Product {
    private String name;
    private double basePrice;
    private ThueStrategy taxStrategy; // Composition

    public Product(String name, double basePrice, ThueStrategy taxStrategy) {
        this.name = name;
        this.basePrice = basePrice;
        this.taxStrategy = taxStrategy;
    }

    // Cho phép thay đổi chiến lược tại thời điểm thực thi (Dynamic behavior)
    public void setTaxStrategy(ThueStrategy taxStrategy) {
        this.taxStrategy = taxStrategy;
    }

    public double getFinalPrice() {
        double taxAmount = taxStrategy.calculate(this.basePrice);
        return this.basePrice + taxAmount;
    }

    public void displayInvoice() {
        System.out.println("Product: " + name);
        System.out.println("Base Price: " + basePrice);
        System.out.println("Tax Applied: " + taxStrategy.getTaxType());
        System.out.println("Total: " + getFinalPrice());
        System.out.println("--------------------------------");
    }
}