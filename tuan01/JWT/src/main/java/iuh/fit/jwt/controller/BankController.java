package iuh.fit.jwt.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BankController {

    @GetMapping("/balance")
    public String getBalance() {
        return "So du cua ban la: 999 Ty VND. (Ban da xac thuc thanh cong!)";
    }
}