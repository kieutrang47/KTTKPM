package iuh.fit.jwt.service.impl;

import iuh.fit.jwt.dto.request.LoginRequest;
import iuh.fit.jwt.dto.response.ApiResponse;
import iuh.fit.jwt.exception.AppException;
import iuh.fit.jwt.service.AuthService;
import iuh.fit.jwt.service.RedisService;
import iuh.fit.jwt.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisService redisService;

    // Giả lập DB User
    private static final Map<String, String> USERS = Map.of("trang", "123");

    @Override
    public ApiResponse<String> login(LoginRequest request) {
        String passInDb = USERS.get(request.getUsername());
        if (passInDb == null || !passInDb.equals(request.getPassword())) {
            throw new AppException(1001, "Tài khoản hoặc mật khẩu sai rồi!");
        }

        String token = jwtUtil.generateToken(request.getUsername());

        return ApiResponse.<String>builder()
                .result(token)
                .message("Đăng nhập thành công")
                .build();
    }

    @Override
    public ApiResponse<String> logout(String token) {
        if (token.startsWith("Bearer ")) token = token.substring(7);

        Date expiration = jwtUtil.extractExpiration(token);
        long ttl = expiration.getTime() - System.currentTimeMillis();

        if (ttl > 0) {
            redisService.saveToBlacklist(token, ttl);
        }

        return ApiResponse.<String>builder()
                .message("Đăng xuất thành công")
                .build();
    }
}