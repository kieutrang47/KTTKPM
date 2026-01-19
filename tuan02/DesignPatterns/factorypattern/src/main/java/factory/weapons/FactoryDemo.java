package factory.weapons;

import factory.WeaponFactory;
import factory.weapons.Weapon;

public class FactoryDemo {
    public static void main(String[] args) {
        System.out.println("=== DEMO FACTORY PATTERN - WEAPON FACTORY ===\n");

        System.out.println("1 Tạo các loại vũ khí khác nhau:");

        // Tạo kiếm
        System.out.println("\n--- Tạo Kiếm ---");
        Weapon sword1 = WeaponFactory.createWeapon("sword", "Kiếm Sắt");
        Weapon sword2 = WeaponFactory.createWeapon("sword", "Kiếm Thần Excalibur");

        sword1.attack();
        ((factory.weapons.Sword) sword1).sharpen();
        sword2.specialAbility();

        // Tạo cung
        System.out.println("\n--- Tạo Cung ---");
        Weapon bow1 = WeaponFactory.createWeapon("bow", "Cung Gỗ");
        Weapon bow2 = WeaponFactory.createWeapon("bow", "Cung Thần Apollo", 20);

        bow1.attack();
        bow1.attack();
        bow1.attack();
        bow2.specialAbility();

        // Tạo phép thuật
        System.out.println("\n--- Tạo Phép Thuật ---");
        Weapon spell1 = WeaponFactory.createWeapon("spell", "Lửa Thiêu Đốt");
        Weapon spell2 = WeaponFactory.createWeapon("spell", "Băng Giá Vĩnh Cửu");
        Weapon spell3 = WeaponFactory.createWeapon("spell", "Sét Thần Zeus", 3);

        spell1.attack();
        spell2.attack();
        spell3.specialAbility();

        // Demo tính linh hoạt của Factory
        System.out.println("\n2 Demo tính linh hoạt:");
        System.out.println("Tạo vũ khí từ dữ liệu động:");

        String[] weaponRequests = {
                "sword,Dragon Slayer",
                "bow,Long Bow of Accuracy",
                "spell,Fireball"
        };

        for (String request : weaponRequests) {
            String[] parts = request.split(",");
            String type = parts[0];
            String name = parts[1];

            System.out.println("\nYêu cầu: " + type + " - " + name);
            Weapon weapon = WeaponFactory.createWeapon(type, name);
            System.out.print("Kết quả: ");
            weapon.attack();
        }

        // Demo xử lý lỗi
        System.out.println("\n3 Demo xử lý lỗi:");
        try {
            Weapon unknown = WeaponFactory.createWeapon("axe", "Rìu Chiến");
        } catch (IllegalArgumentException e) {
            System.out.println(" Lỗi: " + e.getMessage());
        }

        // Demo mở rộng dễ dàng
        System.out.println("\n4 Demo tính mở rộng:");
        System.out.println("Nếu muốn thêm vũ khí mới (VD: Spear):");
        System.out.println("1. Tạo class Spear implements Weapon");
        System.out.println("2. Thêm case 'spear' vào WeaponFactory");
        System.out.println("3. Xong! Có thể tạo Spear ngay lập tức");

        // Thống kê
        System.out.println("\n5 Thống kê vũ khí đã tạo:");
        System.out.println("Factory đã tạo được nhiều loại vũ khí khác nhau");
        System.out.println("mà code sử dụng không cần biết chi tiết tạo ra sao!");
    }
}