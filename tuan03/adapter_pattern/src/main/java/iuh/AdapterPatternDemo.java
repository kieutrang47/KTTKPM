package iuh;

// ========== CLIENT CODE ==========
/**
 * Client Code - chỉ biết làm việc với JSONService interface
 * Không biết về sự tồn tại của LegacyXMLService
 */
public class AdapterPatternDemo {
    public static void main(String[] args) {
        System.out.println(" === ADAPTER PATTERN DEMO ===\n");
        System.out.println("Scenario: Modern system expects JSON, but legacy system only handles XML\n");

        // 1. Tạo hệ thống cũ (chỉ xử lý XML)
        LegacyXMLService legacySystem = new LegacyXMLService("DataProcessor");

        // 2. Tạo adapter, bao bọc hệ thống cũ
        JSONService adapter = new XMLToJSONAdapter(legacySystem);

        System.out.println("\n Test Case 1: Simple User Data (JSON → XML)");
        System.out.println("=============================================");
        String userJSON = "{\"user\": {\"name\": \"John Doe\", \"age\": 30, \"email\": \"john@example.com\"}}";

        if (((XMLToJSONAdapter) adapter).isValidJSON(userJSON)) {
            adapter.processJSON(userJSON);
        }

        System.out.println("\n Test Case 2: Product Catalog (JSON → XML)");
        System.out.println("============================================");
        String productJSON = "{\"catalog\": {\"product\": {\"id\": 101, \"name\": \"Laptop\", \"price\": 999.99, \"inStock\": true}}}";
        adapter.processJSON(productJSON);

        System.out.println("\n Test Case 3: Complex Nested Data");
        System.out.println("===================================");
        String complexJSON = "{\"company\": {\"name\": \"TechCorp\", \"employees\": [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}], \"departments\": {\"engineering\": {\"head\": \"Charlie\"}}}}";
        adapter.processJSON(complexJSON);

        System.out.println("\n Two-Way Conversion Demo");
        System.out.println("=========================");

        try {
            // Chuyển đổi XML → JSON
            String testXML = "<data><test>value</test><number>123</number></data>";
            String convertedJSON = ((XMLToJSONAdapter) adapter).convertXMLtoJSON(testXML);
            System.out.println("XML Input: " + testXML);
            System.out.println("JSON Output:\n" + convertedJSON);
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("\n System Information");
        System.out.println("====================");
        System.out.println(adapter.getServiceInfo());

        System.out.println("\n Adapter Pattern Benefits:");
        System.out.println("============================");
        System.out.println("1. Compatibility: Cho phép hệ thống cũ và mới làm việc cùng nhau");
        System.out.println("2. Reusability: Tái sử dụng code hệ thống cũ mà không cần sửa đổi");
        System.out.println("3. Single Responsibility: Adapter chỉ làm nhiệm vụ chuyển đổi");
        System.out.println("4. Flexibility: Có thể thay đổi adapter mà không ảnh hưởng client");
    }
}