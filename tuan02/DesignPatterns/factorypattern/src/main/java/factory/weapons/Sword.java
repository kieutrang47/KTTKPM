package factory.weapons;

public class Sword implements Weapon {
    private String name;
    private int damage;
    private int sharpness; // độ sắc

    public Sword(String name, int damage, int sharpness) {
        this.name = name;
        this.damage = damage;
        this.sharpness = sharpness;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public int getDamage() {
        return damage + sharpness; // Độ sắc làm tăng damage
    }

    @Override
    public String getAttackSound() {
        return "Vù! Vù!";
    }

    @Override
    public void attack() {
        System.out.println(" Chém bằng " + name + "! Âm thanh: " + getAttackSound());
        System.out.println("   Gây " + getDamage() + " sát thương!");
    }

    @Override
    public void specialAbility() {
        System.out.println("  Kỹ năng đặc biệt: Xoay kiếm 360 độ!");
        System.out.println("   Gây thêm " + (damage * 2) + " sát thương diện rộng!");
    }

    public void sharpen() {
        sharpness += 10;
        System.out.println(" Mài kiếm " + name + "! Độ sắc: " + sharpness);
    }
}