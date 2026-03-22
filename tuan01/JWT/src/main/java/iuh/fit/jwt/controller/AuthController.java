package iuh.fit.jwt.controller;

import iuh.fit.jwt.dto.request.LoginRequest;
import iuh.fit.jwt.dto.response.ApiResponse;
import iuh.fit.jwt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestHeader("Authorization") String token) {
        return authService.logout(token);
    }
}