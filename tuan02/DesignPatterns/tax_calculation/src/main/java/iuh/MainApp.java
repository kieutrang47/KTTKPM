package iuh;

public class MainApp {
    public static void main(String[] args) {
        // Khởi tạo Context với một Concrete Strategy cụ thể
        Product laptop = new Product("MacBook Pro", 2000.0, new ThueVAT());
        laptop.displayInvoice();

        // Thay đổi Strategy tại Runtime
        System.out.println("[System Update] Re-calculating with Luxury Tax...");
        laptop.setTaxStrategy(new ThueXaXi()); //taxstrategy file chữa 10%
        laptop.displayInvoice();
    }
}