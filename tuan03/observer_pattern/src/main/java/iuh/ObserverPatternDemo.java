package iuh;
// ========== CLIENT CODE ==========
/**
 * Client code - minh họa cơ chế publish-subscribe của Observer Pattern
 * Subject (Stock) không biết chi tiết về Observers (Investor)
 */
public class ObserverPatternDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println(" === OBSERVER PATTERN DEMO ===\n");
        System.out.println(" Simulating Stock Market Notifications\n");

        // Tạo Subject (cổ phiếu)
        Stock appleStock = new Stock("AAPL", 150.00);
        Stock googleStock = new Stock("GOOGL", 2800.00);

        // Tạo Observers (nhà đầu tư)
        Investor john = new Investor("John Doe", 160.00);
        Investor jane = new Investor("Jane Smith", 155.00);
        Investor bob = new Investor("Bob Johnson", 2850.00);

        System.out.println("\n Initial Setup:");
        System.out.println("=================");

        // Đăng ký observers với subjects
        appleStock.attach(john);
        appleStock.attach(jane);
        googleStock.attach(bob);

        // John mua một số cổ phiếu
        john.buyShares(appleStock, 10);

        System.out.println("\n Simulating Trading Day:");
        System.out.println("=========================");

        // Mô phỏng biến động giá - observers tự động nhận thông báo
        Thread.sleep(1000);
        appleStock.setPrice(152.50);

        Thread.sleep(1000);
        appleStock.setPrice(156.75);  // Vượt ngưỡng của Jane

        Thread.sleep(1000);
        appleStock.setPrice(162.25);  // Vượt ngưỡng của cả John và Jane

        Thread.sleep(1000);
        googleStock.setPrice(2820.00);

        System.out.println("\n Dynamic Subscription Changes:");
        System.out.println("===============================");

        // Đăng ký/d hủy đăng ký động
        appleStock.detach(jane);
        appleStock.attach(bob);  // Bob bắt đầu theo dõi AAPL

        Thread.sleep(1000);
        appleStock.setPrice(158.50);  // Jane không nhận thông báo, Bob nhận

        System.out.println("\n System Statistics:");
        System.out.println("====================");
        System.out.println("AAPL Observers: " + appleStock.getObserverCount());
        System.out.println("GOOGL Observers: " + googleStock.getObserverCount());

        System.out.println("\n Observer Pattern Benefits:");
        System.out.println("============================");
        System.out.println("1. Loose Coupling: Stock không biết Investor chi tiết");
        System.out.println("2. Dynamic Relationships: Có thể đăng ký/hủy bất kỳ lúc nào");
        System.out.println("3. Broadcast Notifications: Một thay đổi → nhiều observers");
    }
}