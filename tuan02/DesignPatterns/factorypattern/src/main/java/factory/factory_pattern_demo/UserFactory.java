package factory.factory_pattern_demo;


public class UserFactory {

    public static User createUser(String type) {
        if ("STUDENT".equals(type)) {
            return new Student();
        }
        if ("LECTURER".equals(type)) {
            return new Lecturer();
        }
        throw new RuntimeException("Loại user không hợp lệ");
    }
}
