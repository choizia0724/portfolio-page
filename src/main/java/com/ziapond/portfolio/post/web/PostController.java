package com.ziapond.portfolio.post.web;

import com.ziapond.portfolio.post.domain.Post;
import com.ziapond.portfolio.post.repository.PostRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository repo;

    private final JdbcTemplate jdbcTemplate; // <== 추가

    @GetMapping("/dbping")
    public Map<String, String> dbping() {
        Integer one = jdbcTemplate.queryForObject("select 1", Integer.class);
        return Map.of("db", (one != null && one == 1) ? "UP" : "DOWN");
    }

    @GetMapping("/health")
    public Map<String, String> health() { return Map.of("status", "UP"); }

    // READ: 전체 공개
    @GetMapping("/posts")
    public List<Post> list() { return repo.findAllOrderByCreatedAtDesc(); }

    @GetMapping("/posts/{id}")
    public ResponseEntity<Post> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // WRITE: ADMIN만 (SecurityConfig에서 권한 체크)
    @PostMapping("/posts")
    public Post create(@RequestBody @Valid PostRequest req) {
        Post p = Post.builder()
                .title(req.title())
                .contentMd(req.contentMd())
                .published(true)
                .build();
        return repo.save(p);
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody @Valid PostRequest req) {
        return repo.findById(id).map(p -> {
            p.setTitle(req.title());
            p.setContentMd(req.contentMd());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    public record PostRequest(@NotBlank String title, @NotBlank String contentMd) {}
}
