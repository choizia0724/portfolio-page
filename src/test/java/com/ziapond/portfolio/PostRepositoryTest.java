package com.ziapond.portfolio;

import com.ziapond.portfolio.post.domain.Post;
import com.ziapond.portfolio.post.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PostRepositoryTest {

    @Autowired
    PostRepository repo;

//    @Test
//    void crud() {
//        // create
//        Post saved = repo.save(Post.builder()
//                .title("hello")
//                .contentMd("# hi")
//                .published(true)
//                .build());
//        assertThat(saved.getId()).isNotNull();
//
//        // read
//        Post found = repo.findById(saved.getId()).orElseThrow();
//        assertThat(found.getTitle()).isEqualTo("hello");
//
//        // update
//        found.setTitle("updated");
//        Post updated = repo.save(found);
//        assertThat(updated.getTitle()).isEqualTo("updated");
//
//        // delete
//        repo.deleteById(updated.getId());
//        assertThat(repo.findById(updated.getId())).isEmpty();
//    }@Test
//    void crud() {
//        // create
//        Post saved = repo.save(Post.builder()
//                .title("hello")
//                .contentMd("# hi")
//                .published(true)
//                .build());
//        assertThat(saved.getId()).isNotNull();
//
//        // read
//        Post found = repo.findById(saved.getId()).orElseThrow();
//        assertThat(found.getTitle()).isEqualTo("hello");
//
//        // update
//        found.setTitle("updated");
//        Post updated = repo.save(found);
//        assertThat(updated.getTitle()).isEqualTo("updated");
//
//        // delete
//        repo.deleteById(updated.getId());
//        assertThat(repo.findById(updated.getId())).isEmpty();
//    }
}
