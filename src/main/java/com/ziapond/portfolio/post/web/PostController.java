package com.ziapond.portfolio.post.web;

import com.ziapond.portfolio.post.vo.PostRequest;
import com.ziapond.portfolio.post.domain.Post;
import com.ziapond.portfolio.post.repository.PostRepository;
import com.ziapond.portfolio.post.service.GithubReadmeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository repo;
    private final JdbcTemplate jdbcTemplate;
    private final GithubReadmeService githubReadmeService;

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

    // create
    @PostMapping("/posts")
    public Post create(@RequestBody PostRequest req) {
        Post p = new Post();
        p.setTitle(req.getTitle());
        p.setContentMd(req.getContentMd());
        p.setReadmeUrl(req.getReadmeUrl());
        p.setPublished(true);
        return repo.save(p);
    }


    @PutMapping("/posts/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody @Valid PostRequest req) {
        return repo.findById(id).map(p -> {
            p.setTitle(req.getTitle());
            p.setContentMd(req.getContentMd());
            p.setReadmeUrl(req.getReadmeUrl());
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


    @GetMapping(value = "/github/readme", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getReadme(@RequestParam String url) {
        return githubReadmeService.fetchReadmeMd(url);
    }

    @GetMapping(value = "/posts/{id}/combined-md", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> combined(@PathVariable Long id) {
        return repo.findById(id).map(p -> {
            String head = Optional.ofNullable(p.getContentMd()).orElse("");
            String tail = Optional.ofNullable(p.getReadmeUrl())
                    .filter(u -> !u.isBlank())
                    .map(githubReadmeService::fetchReadmeMd)
                    .orElse("");
            String divider = (head.isBlank() || tail.isBlank()) ? "\n" : "\n\n---\n\n";
            return ResponseEntity.ok(head + divider + tail);
        }).orElse(ResponseEntity.notFound().build());
    }
}
