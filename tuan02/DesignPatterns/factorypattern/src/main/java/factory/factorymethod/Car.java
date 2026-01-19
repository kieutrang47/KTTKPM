package factory.factorymethod;


public class Car implements Vehicle {
    @Override
    public void move() {
        System.out.println("Di chuyển bằng Ô TÔ");
    }
}
