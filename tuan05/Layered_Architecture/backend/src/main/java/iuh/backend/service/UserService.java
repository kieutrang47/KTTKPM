package iuh.backend.service;
import iuh.backend.entity.User;
import iuh.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired private UserRepository repository;
    public List<User> getAllUsers() { return repository.findAll(); }
    public User createUser(User user) {
        // Business Logic: Chỉ cho phép 3 role này
        if(!user.getRole().equals("Admin") && !user.getRole().equals("Editor") && !user.getRole().equals("Author")) {
            throw new IllegalArgumentException("Quyền không hợp lệ!");
        }
        return repository.save(user);
    }
}