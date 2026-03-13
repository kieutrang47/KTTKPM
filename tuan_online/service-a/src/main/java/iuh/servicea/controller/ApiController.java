package iuh.servicea.controller;


import iuh.servicea.service.ResilienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/resilience")
public class ApiController {

    @Autowired
    private ResilienceService resilienceService;

    @GetMapping("/retry")
    public Map<String, Object> testRetry() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("pattern", "Retry");
        response.put("description", "Tests retry pattern with 40% failure rate");

        try {
            String result = resilienceService.testRetry();
            response.put("status", "success");
            response.put("data", result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/circuit-breaker")
    public Map<String, Object> testCircuitBreaker() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("pattern", "Circuit Breaker");
        response.put("description", "Tests circuit breaker (fails after 3 requests)");

        try {
            String result = resilienceService.testCircuitBreaker();
            response.put("status", "success");
            response.put("data", result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/rate-limiter")
    public Map<String, Object> testRateLimiter() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("pattern", "Rate Limiter");
        response.put("description", "Tests rate limiter (5 requests per minute)");

        try {
            String result = resilienceService.testRateLimiter();
            response.put("status", "success");
            response.put("data", result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/bulkhead")
    public Map<String, Object> testBulkhead() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("pattern", "Bulkhead");
        response.put("description", "Tests bulkhead (max 3 concurrent calls)");

        try {
            String result = resilienceService.testBulkhead();
            response.put("status", "success");
            response.put("data", result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/combined")
    public Map<String, Object> testCombined() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("pattern", "All Patterns (Retry + Circuit Breaker + Rate Limiter + Bulkhead)");
        response.put("description", "Tests all resilience patterns combined");

        try {
            String result = resilienceService.testAllPatterns();
            response.put("status", "success");
            response.put("data", result);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
        }

        return response;
    }

    @GetMapping("/direct")
    public Map<String, Object> directCall() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("description", "Direct call to Service B (no resilience patterns)");

        String result = resilienceService.directCall();
        response.put("status", "success");
        response.put("data", result);

        return response;
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("service", "Service A - Spring Boot with Resilience4J");
        info.put("port", 8080);
        info.put("timestamp", LocalDateTime.now());
        info.put("serviceBUrl", "http://localhost:3001");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("retry", "/api/v1/resilience/retry");
        endpoints.put("circuit-breaker", "/api/v1/resilience/circuit-breaker");
        endpoints.put("rate-limiter", "/api/v1/resilience/rate-limiter");
        endpoints.put("bulkhead", "/api/v1/resilience/bulkhead");
        endpoints.put("combined", "/api/v1/resilience/combined");
        endpoints.put("direct", "/api/v1/resilience/direct");
        endpoints.put("info", "/api/v1/resilience/info");

        info.put("endpoints", endpoints);
        info.put("patterns", new String[]{"Retry", "Circuit Breaker", "Rate Limiter", "Bulkhead"});

        return info;
    }
}