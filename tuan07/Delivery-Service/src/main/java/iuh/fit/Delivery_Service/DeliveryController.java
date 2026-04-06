package iuh.fit.Delivery_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // Cho phép React gọi
@RequestMapping("/payments")
public class DeliveryController {

    @Value("${order.service.url:http://localhost:8083}")
    private String orderServiceUrl;

    @Autowired private OrderRepository orderRepo;

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody FoodOrder orderData) {
        Long originalOrderId = orderData.getId();

        // Save local audit (bỏ ID được truyền từ service kia qua để tránh JPA detach error)
        orderData.setId(null);
        orderData.setStatus("PAID");
        orderRepo.save(orderData);

        // Print Notification (Exactly matching requirement string)
        System.out.println("User " + orderData.getCustomerName() + " đã đặt đơn #" + originalOrderId + " thành công");

        // Cập nhật Order Service thông qua REST
        RestTemplate restTemplate = new RestTemplate();
        try {
            Map<String, String> statusUpdate = new HashMap<>();
            statusUpdate.put("status", "PAID");
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(statusUpdate);
            restTemplate.exchange(orderServiceUrl + "/orders/" + originalOrderId + "/status", HttpMethod.PUT, requestEntity, String.class);
        } catch(Exception e) {
            System.err.println("Gửi thông báo cập nhật Order thất bại: " + e.getMessage());
        }

        return ResponseEntity.ok("Payment processed successfully");
    }
}