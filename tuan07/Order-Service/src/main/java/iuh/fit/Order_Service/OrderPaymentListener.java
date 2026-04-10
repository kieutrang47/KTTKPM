package iuh.fit.Order_Service;


import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class OrderPaymentListener implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] pattern) {
        // Khi Payment Service bắn event, code sẽ tự động nhảy vào hàm này
        String msgBody = new String(message.getBody());
        System.out.println("🎯 Order Service nhận Event từ Redis: " + msgBody);

        // TODO: Dùng ObjectMapper (Jackson) parse msgBody ra lấy orderId
        // Gọi OrderRepository update trạng thái đơn hàng thành PAID
    }
}
