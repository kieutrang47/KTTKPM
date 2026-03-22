package iuh.fit.jwt.controller;

import iuh.fit.jwt.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BankController {

    @GetMapping("/balance")
    public ApiResponse<String> getBalance() {
        //gói ApiResponse
        return ApiResponse.<String>builder()
                .code(200) // Mã thành công
                .message("Xác thực thành công! Đây là dữ liệu bảo mật.")
                .result("Số dư của bạn là: 999 Tỷ VNĐ") // Dữ liệu chính nằm ở đây
                .build();
    }
}