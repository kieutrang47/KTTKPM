package com.example.partition.controller;

import com.example.partition.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String gender = payload.get("gender");
        String email = payload.get("email");

        Object saved = userService.saveUser(name, gender, email);
        return ResponseEntity.ok(Map.of(
            "message", "Lưu thành công. Đã tự động route vào bảng " + ("Nam".equalsIgnoreCase(gender) ? "table_user_01" : "table_user_02"),
            "data", saved
        ));
    }

    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String gender) {
        return ResponseEntity.ok(Map.of(
            "message", "Lấy dữ liệu với điều kiện Partition",
            "gender_filter", gender != null ? gender : "Tất cả",
            "data", userService.getUsersByGender(gender)
        ));
    }
}
