package factory.weapons;

public interface Weapon {
    String getName();
    int getDamage();
    String getAttackSound();
    void attack();
    void specialAbility();
}