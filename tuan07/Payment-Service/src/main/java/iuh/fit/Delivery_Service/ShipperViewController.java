package iuh.fit.Delivery_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ShipperViewController {

    @Autowired
    private OrderRepository orderRepo;

    @GetMapping("/shipper")
    public String shipperPage(Model model) {
        model.addAttribute("orders", orderRepo.findAll());
        return "shipper";
    }
}
