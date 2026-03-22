package iuh.backend.controller;


import iuh.backend.entity.Post;
import iuh.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Mở cửa cho ReactJS gọi vào không bị lỗi CORS
public class PostController {

    @Autowired
    private PostService service;

    @GetMapping
    public List<Post> getPosts() {
        return service.getAllPosts(); // Giao việc cho Service
    }

    @PostMapping
    public Post addPost(@RequestBody Post post) {
        return service.createPost(post); // Giao việc cho Service
    }
}