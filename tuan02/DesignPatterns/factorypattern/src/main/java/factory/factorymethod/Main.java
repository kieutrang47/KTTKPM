package factory.factorymethod;


public class Main {
    public static void main(String[] args) {

        // Singleton demo
        AppConfig config1 = AppConfig.getInstance();
        AppConfig config2 = AppConfig.getInstance();

        System.out.println(config1.getAppName());
        System.out.println(config1 == config2); // true

        // Factory Method demo
        Vehicle v1 = VehicleFactory.createVehicle("MOTORBIKE");
        v1.move();

        Vehicle v2 = VehicleFactory.createVehicle("CAR");
        v2.move();
    }
}
