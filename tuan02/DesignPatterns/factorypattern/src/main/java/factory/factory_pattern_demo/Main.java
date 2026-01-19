package factory.factory_pattern_demo;

public class Main {
    public static void main(String[] args) {

        User u1 = UserFactory.createUser("STUDENT");
        u1.showRole();

        User u2 = UserFactory.createUser("LECTURER");
        u2.showRole();
    }
}