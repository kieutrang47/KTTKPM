package iuh.fit.Order_Service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class OrderPaymentListener implements MessageListener {

    @Autowired
    private OrderRepository orderRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Khi Payment Service bắn event, code sẽ tự động nhảy vào hàm này
            String msgBody = new String(message.getBody());
            System.out.println("🎯 Order Service nhận Event từ Redis: " + msgBody);

            // Parse JSON để lấy orderId và status
            JsonNode jsonNode = objectMapper.readTree(msgBody);
            Long orderId = jsonNode.get("orderId").asLong();
            String status = jsonNode.get("status").asText();

            // Tìm order và update status
            orderRepository.findById(orderId).ifPresent(order -> {
                order.setStatus(status);
                orderRepository.save(order);
                System.out.println("✅ Đã cập nhật Order #" + orderId + " thành trạng thái: " + status);
            });

        } catch (Exception e) {
            System.err.println("❌ Lỗi khi xử lý Redis message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
