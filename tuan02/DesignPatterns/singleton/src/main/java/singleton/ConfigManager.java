package singleton;

// File 1: ConfigManager.java
public class ConfigManager {
    // BIẾN DUY NHẤT lưu instance
    private static ConfigManager instance;

    // Dữ liệu cấu hình
    private String databaseUrl;
    private int maxConnections;

    // 1. CONSTRUCTOR PRIVATE
    private ConfigManager() {
        // Load cấu hình mặc định
        databaseUrl = "localhost:3306/mydb";
        maxConnections = 10;
        System.out.println("[Singleton] Đã tạo ConfigManager");
    }

    // 2. PHƯƠNG THỨC LẤY INSTANCE
    public static ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }

    // Getter/Setter
    public String getDatabaseUrl() { return databaseUrl; }
    public void setDatabaseUrl(String url) { this.databaseUrl = url; }

    public int getMaxConnections() { return maxConnections; }
    public void setMaxConnections(int max) { this.maxConnections = max; }

    // Hiển thị cấu hình
    public void showConfig() {
        System.out.println("=== CẤU HÌNH HIỆN TẠI ===");
        System.out.println("Database: " + databaseUrl);
        System.out.println("Max connections: " + maxConnections);
        System.out.println("=======================");
    }
}