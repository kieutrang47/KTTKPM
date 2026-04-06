package iuh.fit.Order_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @Value("${food.service.url:http://localhost:8082}")
    private String foodServiceUrl;

    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;

    @Value("${payment.service.url:http://localhost:8084}")
    private String paymentServiceUrl;

    @GetMapping
    public List<FoodOrder> getOrders() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody FoodOrder order) {
        RestTemplate rest = new RestTemplate();
        
        // 1. Lấy Food Service để Validate món ăn
        try {
            rest.getForEntity(foodServiceUrl + "/foods", List.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối tới Food Service để xác thực món ăn!");
        }

        // 2. Gọi User Service để Validate user
        try {
            rest.getForEntity(userServiceUrl + "/users", List.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối tới User Service để xác thực người dùng!");
        }
        
        // 3. Default status
        order.setStatus("ORDERED");
        repo.save(order);

        // 4. Call Payment Service
        try {
             ResponseEntity<String> payRes = rest.postForEntity(paymentServiceUrl + "/payments", order, String.class);
             if(!payRes.getStatusCode().is2xxSuccessful()) throw new RuntimeException("Payment returned " + payRes.getStatusCode().value());
        } catch (Exception e) {
             System.out.println("Error calling Payment Service: " + e.getMessage());
             return ResponseEntity.status(500).body("Backend Error: " + e.getMessage());
        }

        return ResponseEntity.ok(order);
    }

    // 5. Endpoint để Payment Service update status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return repo.findById(id).map(order -> {
            order.setStatus(payload.get("status"));
            repo.save(order);
            return ResponseEntity.ok(order);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}