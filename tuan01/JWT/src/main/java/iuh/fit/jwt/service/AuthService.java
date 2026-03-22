package iuh.fit.jwt.service;

import iuh.fit.jwt.dto.request.LoginRequest;
import iuh.fit.jwt.dto.response.ApiResponse;

public interface AuthService {
    ApiResponse<String> login(LoginRequest request);
    ApiResponse<String> logout(String token);
}