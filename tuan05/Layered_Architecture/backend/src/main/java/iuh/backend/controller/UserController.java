package iuh.backend.controller;
import iuh.backend.entity.User;
import iuh.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired private UserService service;
    @GetMapping public List<User> getUsers() { return service.getAllUsers(); }
    @PostMapping public User addUser(@RequestBody User user) { return service.createUser(user); }
}