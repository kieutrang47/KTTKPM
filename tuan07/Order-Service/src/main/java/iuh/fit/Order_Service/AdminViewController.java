package iuh.fit.Order_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminViewController {

    @Autowired
    private OrderRepository orderRepo;

    @GetMapping("/admin")
    public String adminDashboard(Model model) {
        model.addAttribute("orders", orderRepo.findAll());
        return "admin";
    }
}
