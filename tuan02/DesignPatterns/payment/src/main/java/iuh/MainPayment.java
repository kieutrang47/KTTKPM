package iuh;

public class MainPayment {
    public static void main(String[] args) {
        System.out.println("=== HỆ THỐNG THANH TOÁN DECORATOR ===\n");

        // 1. Thanh toán thẻ bình thường
        Payment payment1 = new CreditCardPayment();
        System.out.println("Đơn 1: " + payment1.getDescription() + " | Tổng: " + payment1.getCost());

        // 2. Thanh toán PayPal có Phí xử lý
        Payment payment2 = new PayPalPayment();
        payment2 = new ProcessingFeeDecorator(payment2);
        System.out.println("Đơn 2: " + payment2.getDescription() + " | Tổng: " + payment2.getCost());

        // 3. Thanh toán Thẻ vừa có Phí vừa có Giảm giá
        Payment payment3 = new CreditCardPayment();
        payment3 = new ProcessingFeeDecorator(payment3);
        payment3 = new DiscountDecorator(payment3);    
        System.out.println("Đơn 3: " + payment3.getDescription() + " | Tổng: " + payment3.getCost());
    }
}