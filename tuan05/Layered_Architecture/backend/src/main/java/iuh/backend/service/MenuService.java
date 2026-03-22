package iuh.backend.service;
import iuh.backend.entity.Menu;
import iuh.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {
    @Autowired private MenuRepository repository;
    public List<Menu> getAllMenus() { return repository.findAll(); }
    public Menu createMenu(Menu menu) { return repository.save(menu); }
}
