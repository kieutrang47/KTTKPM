package singleton;

// File 2: TestSingleton.java
public class TestSingleton {
    public static void main(String[] args) {
        System.out.println(" TEST SINGLETON PATTERN");
        System.out.println("Mục đích: Đảm bảo chỉ có 1 instance ConfigManager\n");

        // LẦN 1: Lấy instance đầu tiên
        System.out.println("1. Lấy ConfigManager lần 1:");
        ConfigManager config1 = ConfigManager.getInstance();
        config1.showConfig();

        // Thay đổi cấu hình
        System.out.println("\n2. Thay đổi cấu hình:");
        config1.setDatabaseUrl("192.168.1.100:3306/production");
        config1.setMaxConnections(50);
        System.out.println("Đã thay đổi cấu hình qua config1");

        // LẦN 2: Lấy instance thứ hai
        System.out.println("\n3. Lấy ConfigManager lần 2:");
        ConfigManager config2 = ConfigManager.getInstance();
        config2.showConfig();

        // KIỂM TRA: Có phải cùng instance không?
        System.out.println("\n4. KIỂM TRA:");
        System.out.println("config1 == config2? " + (config1 == config2));
        System.out.println("config1: " + config1);
        System.out.println("config2: " + config2);

        // CHỨNG MINH: Thay đổi qua config2, check config1
        System.out.println("\n5. CHỨNG MINH:");
        config2.setMaxConnections(100);
        System.out.println("config2.setMaxConnections(100)");
        System.out.println("config1.getMaxConnections() = " + config1.getMaxConnections());
        System.out.println("→ Thay đổi 1 bên, bên kia cũng thay đổi!");
    }
}