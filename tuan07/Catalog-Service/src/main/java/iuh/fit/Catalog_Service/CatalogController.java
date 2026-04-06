package iuh.fit.Catalog_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CatalogController {

    @Autowired private MenuItemRepository menuRepo;

    @GetMapping("/foods")
    public List<MenuItem> getFoods() {
        return menuRepo.findAll();
    }

    @PostMapping("/foods")
    public MenuItem addFood(@RequestBody MenuItem item) {
        return menuRepo.save(item);
    }

    @PutMapping("/foods/{id}")
    public MenuItem updateFood(@PathVariable Long id, @RequestBody MenuItem updated) {
        return menuRepo.findById(id).map(item -> {
            item.setName(updated.getName());
            item.setPrice(updated.getPrice());
            return menuRepo.save(item);
        }).orElseThrow(() -> new RuntimeException("Food not found"));
    }

    @DeleteMapping("/foods/{id}")
    public void deleteFood(@PathVariable Long id) {
        menuRepo.deleteById(id);
    }
}