package fit.se.apigateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Log thông tin Request từ Frontend
        String clientIp = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        String method = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getPath();

        log.info(">>> Nhận Request: IP={}, Method={}, Path={}", clientIp, method, path);

        // Chuyển tiếp request đến các microservice và log Response trả về
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            var statusCode = exchange.getResponse().getStatusCode();
            log.info("<<< Trả Response: Path={}, Status={}", path, statusCode);
        }));
    }

    @Override
    public int getOrder() {
        // Set độ ưu tiên cao nhất (-1) để filter này chạy đầu tiên
        return -1;
    }
}
