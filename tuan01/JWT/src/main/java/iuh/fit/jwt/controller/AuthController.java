package iuh.fit.jwt.controller;

import iuh.fit.jwt.service.RedisService;
import iuh.fit.jwt.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisService redisService;

    // Giả lập Database
    private static final Map<String, String> users = new HashMap<>();
    static {
        users.put("trang", "123"); // User mặc định
    }

    // 1. LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (users.containsKey(username) && users.get(username).equals(password)) {
            String token = jwtUtil.generateToken(username);
            Map<String, String> res = new HashMap<>();
            res.put("token", token);
            return res;
        } else {
            throw new RuntimeException("Sai thong tin dang nhap");
        }
    }

    // 2. LOGOUT (Có dùng Redis)
    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Tính thời gian còn lại của Token
            Date expiration = jwtUtil.extractExpiration(token);
            long remainingTime = expiration.getTime() - System.currentTimeMillis();

            if (remainingTime > 0) {
                // Đưa vào danh sách đen
                redisService.saveToBlacklist(token, remainingTime);
                return "Da dang xuat thanh cong! Token da bi huy.";
            }
        }
        return "Token khong hop le.";
    }
}