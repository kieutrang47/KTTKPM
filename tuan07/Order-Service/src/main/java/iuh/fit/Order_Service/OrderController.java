package iuh.fit.Order_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @Autowired
    private CartRepository cartRepo;

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

    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Checkout từ giỏ hàng
    @PostMapping("/checkout-cart/{sessionId}")
    @Transactional
    public ResponseEntity<?> checkoutFromCart(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> payload) {
        
        RestTemplate rest = new RestTemplate();
        
        // 1. Lấy tất cả items từ cart
        List<CartItem> cartItems = cartRepo.findBySessionId(sessionId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Giỏ hàng trống!");
        }

        // 2. Validate services
        try {
            rest.getForEntity(foodServiceUrl + "/foods", List.class);
            rest.getForEntity(userServiceUrl + "/users", List.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi kết nối services!");
        }

        // 3. Tạo order từ cart
        FoodOrder order = new FoodOrder();
        order.setCustomerName(payload.get("customerName"));
        order.setPaymentMethod(payload.get("paymentMethod"));
        order.setStatus("ORDERED");

        // Convert cart items to order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(
                cartItem.getFoodItem(),
                cartItem.getQuantity(),
                cartItem.getPrice()
            );
            order.addItem(orderItem);
        }

        order.calculateTotalPrice();
        repo.save(order);

        // 4. Xóa cart sau khi đặt hàng
        cartRepo.deleteBySessionId(sessionId);

        // 5. Call Payment Service
        try {
            ResponseEntity<String> payRes = rest.postForEntity(
                paymentServiceUrl + "/payments", order, String.class);
            if (!payRes.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Payment failed");
            }
        } catch (Exception e) {
            System.out.println("Error calling Payment Service: " + e.getMessage());
            return ResponseEntity.status(500).body("Backend Error: " + e.getMessage());
        }

        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody FoodOrder order) {
        RestTemplate rest = new RestTemplate();
        
        // Validation
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Đơn hàng phải có ít nhất 1 món!");
        }
        
        if (order.getCustomerName() == null || order.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên khách hàng không được để trống!");
        }
        
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
        
        // 3. Calculate total price and set status
        order.calculateTotalPrice();
        order.setStatus("ORDERED");
        
        // Set bidirectional relationship for items
        for (var item : order.getItems()) {
            item.setOrder(order);
        }
        
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