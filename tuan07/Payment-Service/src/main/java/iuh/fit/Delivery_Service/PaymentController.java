package iuh.fit.Delivery_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private OrderRepository orderRepo;

    // 1. Tiêm Redis Template vào để sử dụng
    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody FoodOrder orderData) {
        Long originalOrderId = orderData.getId();

        // Save local audit
        orderData.setId(null);
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
    }
}