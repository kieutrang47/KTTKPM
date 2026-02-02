package iuh;

import java.util.ArrayList;
import java.util.List;

// ========== SUBJECT INTERFACE ==========
/**
 * Subject Interface - đối tượng được quan sát
 * Định nghĩa phương thức để quản lý danh sách observers (đăng ký/hủy)
 */
interface StockSubject {
    void attach(InvestorObserver observer);
    void detach(InvestorObserver observer);
    void notifyObservers();
}

// ========== OBSERVER INTERFACE ==========
/**
 * Observer Interface - đối tượng quan sát
 * Định nghĩa phương thức update() để nhận thông báo khi Subject thay đổi
 */
interface InvestorObserver {
    void update(Stock stock);
}

// ========== CONCRETE SUBJECT - STOCK ==========
/**
 * Concrete Subject - đại diện cho một cổ phiếu
 * Khi giá thay đổi sẽ tự động thông báo cho tất cả observers đã đăng ký
 */
class Stock implements StockSubject {
    private String symbol;
    private double price;
    private List<InvestorObserver> investors;
    private double priceChange;

    public Stock(String symbol, double initialPrice) {
        this.symbol = symbol;
        this.price = initialPrice;
        this.investors = new ArrayList<>();
        this.priceChange = 0.0;
        System.out.println(" Stock " + symbol + " created with initial price: $" + price);
    }

    /**
     * Phương thức  thay đổi giá và kích hoạt thông báo
     * Đây là điểm mà trạng thái của Subject thay đổi
     */
    public void setPrice(double newPrice) {
        double oldPrice = this.price;
        this.priceChange = newPrice - oldPrice;
        this.price = newPrice;

        double percentChange = (priceChange / oldPrice) * 100;

        System.out.printf("\n⚡ [PRICE UPDATE] %s: $%.2f → $%.2f (",
                symbol, oldPrice, newPrice);

        if (priceChange >= 0) {
            System.out.printf(" +$%.2f, +%.2f%%)%n", priceChange, percentChange);
        } else {
            System.out.printf(" -$%.2f, %.2f%%)%n", Math.abs(priceChange), percentChange);
        }

        // Thông báo cho tất cả observers
        notifyObservers();
    }

    @Override
    public void attach(InvestorObserver observer) {
        investors.add(observer);
        System.out.println("✓ " + observer + " started watching " + symbol);
    }

    @Override
    public void detach(InvestorObserver observer) {
        investors.remove(observer);
        System.out.println("✗ " + observer + " stopped watching " + symbol);
    }

    @Override
    public void notifyObservers() {
        // Gửi thông báo cho TẤT CẢ observers đã đăng ký
        for (InvestorObserver investor : investors) {
            investor.update(this);
        }
    }

    // Getter methods
    public double getPrice() { return price; }
    public String getSymbol() { return symbol; }
    public double getPriceChange() { return priceChange; }
    public int getObserverCount() { return investors.size(); }
}

// ========== CONCRETE OBSERVER - INVESTOR ==========
/**
 * Concrete Observer - đại diện cho nhà đầu tư
 * Mỗi observer có thể có logic xử lý thông báo khác nhau
 */
class Investor implements InvestorObserver {
    private String name;
    private double alertThreshold;
    private double totalInvested;
    private int sharesOwned;

    public Investor(String name, double alertThreshold) {
        this.name = name;
        this.alertThreshold = alertThreshold;
        this.totalInvested = 0.0;
        this.sharesOwned = 0;
        System.out.println(" Investor " + name + " created (Alert threshold: $" + alertThreshold + ")");
    }

    @Override
    public void update(Stock stock) {
        double currentPrice = stock.getPrice();
        double priceChange = stock.getPriceChange();

        System.out.printf("   %s received update: %s = $%.2f",
                name, stock.getSymbol(), currentPrice);

        // Logic nghiệp vụ: kiểm tra ngưỡng cảnh báo
        if (currentPrice > alertThreshold) {
            System.out.printf(" [ABOVE THRESHOLD: $%.2f]", alertThreshold);
        }

        // Gợi ý hành động dựa trên biến động giá
        if (priceChange > 0) {
            System.out.print(" 📈 Consider buying");
        } else if (priceChange < 0) {
            System.out.print(" 📉 Consider selling");
        }

        System.out.println();

        // Cập nhật portfolio nếu sở hữu cổ phiếu này
        if (sharesOwned > 0) {
            double portfolioValue = sharesOwned * currentPrice;
            double gainLoss = portfolioValue - totalInvested;
            System.out.printf("     Portfolio: %d shares = $%.2f (",
                    sharesOwned, portfolioValue);

            if (gainLoss >= 0) {
                System.out.printf(" Gain: $%.2f)%n", gainLoss);
            } else {
                System.out.printf(" Loss: $%.2f)%n", Math.abs(gainLoss));
            }
        }
    }

    public void buyShares(Stock stock, int quantity) {
        double cost = stock.getPrice() * quantity;
        this.sharesOwned += quantity;
        this.totalInvested += cost;
        System.out.printf(" %s bought %d shares of %s at $%.2f each (Total: $%.2f)%n",
                name, quantity, stock.getSymbol(), stock.getPrice(), cost);
    }

    @Override
    public String toString() {
        return "Investor " + name;
    }
}
