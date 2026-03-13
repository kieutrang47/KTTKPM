package iuh.servicea.service;

import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@Slf4j
public class ResilienceService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${service.b.base-url}")
    private String serviceBBaseUrl;

    private int totalCalls = 0;
    private int retryCounter = 0;  // Counter riêng cho retry test

    // ==================== RETRY PATTERN ====================
    @Retry(name = "serviceBRetry", fallbackMethod = "retryFallback")
    public String testRetry() {
        retryCounter++;
        log.info("Retry Test - Attempt #{} to Service B at {}", retryCounter, LocalDateTime.now());

        try {
            // Dùng getForEntity để có thể xem status code
            ResponseEntity<String> response = restTemplate.getForEntity(
                    serviceBBaseUrl + "/api/retry-test",
                    String.class
            );

            log.info("Retry Test - Success (HTTP {}): {}",
                    response.getStatusCode().value(),
                    response.getBody());

            return response.getBody();

        } catch (HttpServerErrorException e) {
            // HTTP 5xx errors - sẽ được retry
            log.warn("Retry Test - HTTP {}: {}",
                    e.getStatusCode().value(),
                    e.getResponseBodyAsString());
            throw e; // Re-throw để Resilience4J xử lý retry

        } catch (RestClientException e) {
            // Network/connection errors - sẽ được retry
            log.warn("Retry Test - RestClientException: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            // Các exception khác
            log.error("Retry Test - Unexpected exception: {}", e.getClass().getName(), e);
            throw new RuntimeException("Service B call failed", e);
        }
    }

    public String retryFallback(Exception e) {
        log.warn("Retry Fallback activated after {} attempts: {}",
                retryCounter,
                e.getMessage());

        retryCounter = 0; // Reset counter sau khi fallback

        return String.format("""
            {
                "service": "Service A (Fallback)",
                "pattern": "Retry",
                "status": "fallback",
                "attempts": %d,
                "message": "All retry attempts failed",
                "error": "%s",
                "timestamp": "%s",
                "note": "Retry pattern was triggered but all attempts failed"
            }
            """, 3,  // max-attempts từ config
                e.getMessage(),
                LocalDateTime.now());
    }

    // ==================== CIRCUIT BREAKER PATTERN ====================
    @CircuitBreaker(name = "serviceBCircuitBreaker", fallbackMethod = "circuitBreakerFallback")
    public String testCircuitBreaker() {
        totalCalls++;
        log.info("Circuit Breaker Test - Call #{} to Service B", totalCalls);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    serviceBBaseUrl + "/api/circuit-test",
                    String.class
            );

            return response.getBody();

        } catch (HttpServerErrorException e) {
            log.warn("Circuit Breaker Test - HTTP {}: {}",
                    e.getStatusCode().value(),
                    e.getResponseBodyAsString());
            throw e;
        }
    }

    public String circuitBreakerFallback(Exception e) {
        log.warn("Circuit Breaker Fallback: {}", e.getMessage());
        return String.format("""
            {
                "service": "Service A (Fallback)",
                "pattern": "Circuit Breaker",
                "status": "circuit_open",
                "message": "Circuit is OPEN - Request blocked",
                "error": "%s",
                "timestamp": "%s",
                "note": "Circuit breaker opened after multiple failures"
            }
            """, e.getMessage(), LocalDateTime.now());
    }

    // ==================== RATE LIMITER PATTERN ====================
    @RateLimiter(name = "serviceBRateLimiter", fallbackMethod = "rateLimiterFallback")
    public String testRateLimiter() {
        log.info("Rate Limiter Test - Calling Service B");

        ResponseEntity<String> response = restTemplate.getForEntity(
                serviceBBaseUrl + "/api/rate-test",
                String.class
        );

        return response.getBody();
    }

    public String rateLimiterFallback(Exception e) {
        log.warn("Rate Limiter Fallback: {}", e.getMessage());
        return String.format("""
            {
                "service": "Service A (Fallback)",
                "pattern": "Rate Limiter",
                "status": "rate_limited",
                "message": "Rate limit exceeded - Try again later",
                "timestamp": "%s",
                "note": "Only 5 requests allowed per minute"
            }
            """, LocalDateTime.now());
    }

    // ==================== BULKHEAD PATTERN ====================
    @Bulkhead(name = "serviceBBulkhead", fallbackMethod = "bulkheadFallback")
    public String testBulkhead() {
        log.info("Bulkhead Test - Calling slow endpoint of Service B");

        ResponseEntity<String> response = restTemplate.getForEntity(
                serviceBBaseUrl + "/api/slow",
                String.class
        );

        return response.getBody();
    }

    public String bulkheadFallback(Exception e) {
        log.warn("Bulkhead Fallback: {}", e.getMessage());
        return String.format("""
            {
                "service": "Service A (Fallback)",
                "pattern": "Bulkhead",
                "status": "bulkhead_full",
                "message": "Bulkhead full - Too many concurrent calls",
                "timestamp": "%s",
                "note": "Maximum 3 concurrent calls allowed"
            }
            """, LocalDateTime.now());
    }

    // ==================== COMBINED PATTERNS ====================
    @Retry(name = "serviceBRetry")
    @CircuitBreaker(name = "serviceBCircuitBreaker")
    @RateLimiter(name = "serviceBRateLimiter")
    @Bulkhead(name = "serviceBBulkhead")
    public String testAllPatterns() {
        totalCalls++;
        log.info("Combined Test - Call #{} to Service B", totalCalls);

        ResponseEntity<String> response = restTemplate.getForEntity(
                serviceBBaseUrl + "/api/random",
                String.class
        );

        return response.getBody();
    }

    // ==================== DIRECT CALL (NO PATTERNS) ====================
    public String directCall() {
        try {
            log.info("Direct call to Service B");
            ResponseEntity<String> response = restTemplate.getForEntity(
                    serviceBBaseUrl + "/api/health",
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Direct call failed: {}", e.getMessage());
            return "Direct call failed: " + e.getMessage();
        }
    }
}