package factory.weapons;

public class Bow implements Weapon {
    private String name;
    private int damage;
    private int range; // tầm bắn
    private int arrows;

    public Bow(String name, int damage, int range) {
        this.name = name;
        this.damage = damage;
        this.range = range;
        this.arrows = 10; // Mặc định có 10 mũi tên
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public int getDamage() {
        return damage;
    }

    @Override
    public String getAttackSound() {
        return "Phập!";
    }

    @Override
    public void attack() {
        if (arrows > 0) {
            arrows--;
            System.out.println("🏹  Bắn " + name + "! Âm thanh: " + getAttackSound());
            System.out.println("   Gây " + damage + " sát thương từ xa!");
            System.out.println("   Còn " + arrows + " mũi tên");
        } else {
            System.out.println(" Hết mũi tên! Không thể tấn công!");
        }
    }

    @Override
    public void specialAbility() {
        if (arrows >= 3) {
            arrows -= 3;
            System.out.println(" Kỹ năng đặc biệt: Bắn ba mũi tên!");
            System.out.println("   Gây " + (damage * 3) + " sát thương!");
            System.out.println("   Còn " + arrows + " mũi tên");
        } else {
            System.out.println(" Không đủ mũi tên dùng kỹ năng!");
        }
    }

    public void reload(int count) {
        arrows += count;
        System.out.println(" Nạp " + count + " mũi tên vào " + name);
        System.out.println("   Tổng: " + arrows + " mũi tên");
    }

    public int getRange() {
        return range;
    }
}