package iuh.backend.controller;
import iuh.backend.entity.Menu;
import iuh.backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "*")
public class MenuController {
    @Autowired private MenuService service;
    @GetMapping public List<Menu> getMenus() { return service.getAllMenus(); }
    @PostMapping public Menu addMenu(@RequestBody Menu menu) { return service.createMenu(menu); }
}