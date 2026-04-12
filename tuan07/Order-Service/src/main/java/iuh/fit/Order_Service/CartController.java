package iuh.fit.Order_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepo;

    // Thêm món vào giỏ
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItem item) {
        cartRepo.save(item);
        return ResponseEntity.ok(Map.of("message", "Added to cart", "item", item));
    }

    // Xem giỏ hàng
    @GetMapping("/{sessionId}")
    public List<CartItem> getCart(@PathVariable String sessionId) {
        return cartRepo.findBySessionId(sessionId);
    }

    // Xóa giỏ hàng
    @DeleteMapping("/{sessionId}")
    @Transactional
    public ResponseEntity<?> clearCart(@PathVariable String sessionId) {
        cartRepo.deleteBySessionId(sessionId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
