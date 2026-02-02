package iuh;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.json.JSONObject;
import org.json.XML;

// ========== TARGET INTERFACE ==========
/**
 * Target Interface - định nghĩa giao diện mà Client mong đợi
 * Trong hệ thống mới, tất cả dịch vụ đều làm việc với JSON
 */
interface JSONService {
    void processJSON(String jsonData);
    String getServiceInfo();
}

// ========== ADAPTEE CLASS ==========
/**
 * Adaptee Class - hệ thống cũ đã tồn tại
 * Chỉ có thể xử lý XML, không hỗ trợ JSON
 * Đây là lớp cần được "adapt" để tương thích
 */
class LegacyXMLService {
    private String serviceName;
    private int requestCount;

    public LegacyXMLService(String serviceName) {
        this.serviceName = serviceName;
        this.requestCount = 0;
        System.out.println(" Legacy XML Service '" + serviceName + "' initialized");
    }

    /**
     * Phương thức chính của hệ thống cũ - chỉ xử lý XML
     * Client mới không thể gọi trực tiếp vì họ dùng JSON
     */
    public void processXML(String xmlData) {
        requestCount++;
        System.out.println("\n [Legacy System] Processing request #" + requestCount);
        System.out.println("   Service: " + serviceName);
        System.out.println("   Input XML: " + xmlData);

        try {
            // Parse và xử lý XML
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            org.w3c.dom.Document doc = builder.parse(
                    new org.xml.sax.InputSource(
                            new java.io.StringReader(xmlData)
                    )
            );

            // Trích xuất dữ liệu từ XML
            String rootTag = doc.getDocumentElement().getNodeName();
            System.out.println(" XML parsed successfully");
            System.out.println("   Root element: " + rootTag);
            System.out.println(" Extracted data from XML structure");

        } catch (Exception e) {
            System.out.println(" XML processing error: " + e.getMessage());
        }
    }

    /**
     * Phương thức khác của hệ thống cũ
     */
    public String analyzeXML(String xml) {
        return "Legacy analysis result for XML: " + xml.substring(0, Math.min(xml.length(), 50)) + "...";
    }

    public String getServiceInfo() {
        return "Legacy XML Service: " + serviceName + " (Requests processed: " + requestCount + ")";
    }
}

// ========== ADAPTER CLASS ==========
/**
 * Adapter Class - làm cầu nối giữa Client mới và hệ thống cũ
 * Implement Target interface, bao bọc Adaptee
 * Chịu trách nhiệm chuyển đổi JSON ↔ XML
 */
class XMLToJSONAdapter implements JSONService {
    private LegacyXMLService legacyService;
    private int conversionCount;

    public XMLToJSONAdapter(LegacyXMLService legacyService) {
        this.legacyService = legacyService;
        this.conversionCount = 0;
        System.out.println(" Adapter created: Can now process JSON using legacy XML system");
    }

    @Override
    public void processJSON(String jsonData) {
        conversionCount++;
        System.out.println("\n [Adapter] Processing JSON request #" + conversionCount);
        System.out.println("   Received JSON: " + jsonData);

        try {
            // BƯỚC 1: Chuyển đổi JSON sang XML
            System.out.println("️Converting JSON to XML...");
            String xmlData = convertJSONtoXML(jsonData);
            System.out.println("   ✓ Converted to XML: " + xmlData);

            // BƯỚC 2: Gọi hệ thống cũ để xử lý XML
            legacyService.processXML(xmlData);

            System.out.println(" Request completed via adapter");

        } catch (Exception e) {
            System.out.println(" Adapter error: " + e.getMessage());
        }
    }

    /**
     * Phương thức chuyển đổi JSON → XML
     * Sử dụng thư viện JSON để chuyển đổi
     */
    private String convertJSONtoXML(String json) throws Exception {
        JSONObject jsonObject = new JSONObject(json);
        // Chuyển đổi JSON sang XML với root tag "data"
        String xml = XML.toString(jsonObject, "data");
        return xml;
    }

    /**
     * Phương thức chuyển đổi XML → JSON (two-way adapter)
     */
    public String convertXMLtoJSON(String xml) throws Exception {
        // Chuyển đổi XML sang JSON
        JSONObject jsonObject = XML.toJSONObject(xml);
        return jsonObject.toString(2); // Indent với 2 spaces
    }

    @Override
    public String getServiceInfo() {
        return "JSON Service (via Adapter) | " + legacyService.getServiceInfo() +
                " | Conversions: " + conversionCount;
    }

    /**
     * Phương thức tiện ích: kiểm tra tính hợp lệ của JSON
     */
    public boolean isValidJSON(String json) {
        try {
            new JSONObject(json);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

