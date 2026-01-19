package factory;

import factory.weapons.*;

public class WeaponFactory {

    // Factory Method: Tạo vũ khí dựa trên type
    public static Weapon createWeapon(String type, String name) {
        switch (type.toLowerCase()) {
            case "sword":
                return createSword(name);
            case "bow":
                return createBow(name);
            case "spell":
                return createSpell(name);
            default:
                throw new IllegalArgumentException("Không hỗ trợ loại vũ khí: " + type);
        }
    }

    private static Sword createSword(String name) {
        System.out.println(" Đang rèn kiếm: " + name);

        // Tạo kiếm với thông số khác nhau dựa trên tên
        if (name.contains("Thần")) {
            return new Sword(name, 100, 50);
        } else if (name.contains("Huyền")) {
            return new Sword(name, 80, 40);
        } else {
            return new Sword(name, 50, 20);
        }
    }

    private static Bow createBow(String name) {
        System.out.println(" Đang chế tạo cung: " + name);

        if (name.contains("Cung Thần")) {
            return new Bow(name, 70, 200);
        } else if (name.contains("Cung Dài")) {
            return new Bow(name, 60, 150);
        } else {
            return new Bow(name, 40, 100);
        }
    }

    private static Spell createSpell(String name) {
        System.out.println(" Đang nghiên cứu bùa chú: " + name);

        if (name.contains("Lửa")) {
            return new Spell(name, 90, "Fire", 30);
        } else if (name.contains("Băng")) {
            return new Spell(name, 80, "Ice", 25);
        } else if (name.contains("Sét")) {
            return new Spell(name, 100, "Lightning", 40);
        } else {
            return new Spell(name, 60, "Arcane", 20);
        }
    }

    // Overloaded method với thông số tùy chỉnh
    public static Weapon createWeapon(String type, String name, int power) {
        Weapon weapon = createWeapon(type, name);

        // Tăng sức mạnh dựa trên tham số power
        if (weapon instanceof Sword) {
            Sword sword = (Sword) weapon;
            // Có thể điều chỉnh thông số...
        } else if (weapon instanceof Bow) {
            Bow bow = (Bow) weapon;
            bow.reload(power); // power là số mũi tên thêm
        } else if (weapon instanceof Spell) {
            Spell spell = (Spell) weapon;
            for (int i = 0; i < power; i++) {
                spell.upgrade();
            }
        }

        return weapon;
    }
}