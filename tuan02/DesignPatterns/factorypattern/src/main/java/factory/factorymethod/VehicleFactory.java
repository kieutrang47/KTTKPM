package factory.factorymethod;


public class VehicleFactory {

    public static Vehicle createVehicle(String type) {
        if (type.equalsIgnoreCase("MOTORBIKE")) {
            return new Motorbike();
        } else if (type.equalsIgnoreCase("CAR")) {
            return new Car();
        }
        throw new IllegalArgumentException("Loại phương tiện không hợp lệ");
    }
}
