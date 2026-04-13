package iuh.fit.Delivery_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private OrderRepository orderRepo;

    // 1. Tiêm Redis Template vào để sử dụng
    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping
    public List<FoodOrder> getAllOrders() {
        return orderRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody FoodOrder orderData) {
        try {
            Long originalOrderId = orderData.getId();

            // Debug log
            System.out.println("📦 Nhận order từ Order Service:");
            System.out.println("  - ID: " + originalOrderId);
            System.out.println("  - Customer: " + orderData.getCustomerName());
            System.out.println("  - Items count: " + (orderData.getItems() != null ? orderData.getItems().size() : "null"));

            // Save local audit - Reset IDs để tạo mới
            orderData.setId(null);
            
            // Set bidirectional relationship và reset item IDs
            if (orderData.getItems() != null && !orderData.getItems().isEmpty()) {
                for (var item : orderData.getItems()) {
                    item.setId(null);  // ← QUAN TRỌNG: Reset ID để tạo mới
                    item.setOrder(orderData);
                }
            }
            
            orderData.setStatus("PAID");
            orderRepo.save(orderData);

            // Print Notification (Yêu cầu của đề bài)
            System.out.println("User " + orderData.getCustomerName() + " đã đặt đơn #" + originalOrderId + " thành công");

            // 2. BẮN EVENT QUA REDIS (Thay thế cho RestTemplate cũ)
            try {
                // Tạo chuỗi JSON đơn giản chứa ID đơn hàng
                String eventMessage = String.format("{\"orderId\": %d, \"status\": \"PAID\"}", originalOrderId);

                // Bắn lên kênh có tên "order-payment-channel"
                redisTemplate.convertAndSend("order-payment-channel", eventMessage);

                System.out.println("🚀 Đã bắn thông báo cập nhật Order qua Redis cho đơn #" + originalOrderId);
            } catch(Exception e) {
                System.err.println("Gửi sự kiện Redis thất bại: " + e.getMessage());
            }

            return ResponseEntity.ok("Payment processed successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Lỗi xử lý payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Payment processing failed: " + e.getMessage());
        }
    }
}