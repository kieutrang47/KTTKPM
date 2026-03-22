package iuh.backend.service;
import iuh.backend.entity.Post;
import iuh.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {
    @Autowired private PostRepository repository;
    public List<Post> getAllPosts() { return repository.findAll(); }
    public Post createPost(Post post) {
        if(post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Lỗi: Tiêu đề bài viết không được trống!");
        }
        return repository.save(post);
    }
}