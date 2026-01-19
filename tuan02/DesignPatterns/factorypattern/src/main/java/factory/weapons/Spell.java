package factory.weapons;

public class Spell implements Weapon {
    private String name;
    private int damage;
    private String element; // nguyên tố
    private int manaCost;

    public Spell(String name, int damage, String element, int manaCost) {
        this.name = name;
        this.damage = damage;
        this.element = element;
        this.manaCost = manaCost;
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
        switch (element) {
            case "Fire": return "Rào! Rào!";
            case "Ice": return "Rắc! Rắc!";
            case "Lightning": return "Zzzzt!";
            default: return "Whoosh!";
        }
    }

    @Override
    public void attack() {
        System.out.println(" Thi triển " + name + " [" + element + "]!");
        System.out.println("   Âm thanh: " + getAttackSound());
        System.out.println("   Gây " + damage + " sát thương " + element.toLowerCase());
        System.out.println("   Tiêu hao " + manaCost + " mana");
    }

    @Override
    public void specialAbility() {
        System.out.println(" Kỹ năng đặc biệt: Bão " + element + "!");
        System.out.println("   Gây " + (damage * 5) + " sát thương diện rộng!");
        System.out.println("   Tiêu hao " + (manaCost * 3) + " mana");
    }

    public String getElement() {
        return element;
    }

    public void upgrade() {
        damage += 20;
        System.out.println(" Nâng cấp " + name + "! Sát thương: " + damage);
    }
}