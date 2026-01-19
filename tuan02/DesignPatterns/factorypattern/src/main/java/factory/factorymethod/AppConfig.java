package factory.factorymethod;

public class AppConfig {

    private static AppConfig instance;

    private String appName;

    private AppConfig() {
        appName = "Vehicle Management System";
    }

    public static AppConfig getInstance() {
        if (instance == null) {
            instance = new AppConfig();
        }
        return instance;
    }

    public String getAppName() {
        return appName;
    }
}
