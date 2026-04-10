package iuh.fit.Order_Service;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
public class RedisConfig {

    @Bean
    public RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                                   OrderPaymentListener listener) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // Gắn listener vào đúng Channel mà bên Payment đang bắn
        container.addMessageListener(listener, new ChannelTopic("order-payment-channel"));
        return container;
    }
}
