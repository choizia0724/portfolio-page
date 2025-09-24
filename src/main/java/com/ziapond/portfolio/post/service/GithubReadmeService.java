package com.ziapond.portfolio.post.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.time.Duration;
import java.util.List;

@Service
public class GithubReadmeService {
    private final WebClient web = WebClient.builder()
            .codecs(c -> c.defaultCodecs().maxInMemorySize(3 * 1024 * 1024)) // 3MB 제한
            .build();

    public String fetchReadmeMd(String url) {
        if (url == null || url.isBlank()) return "";
        try {
            URI u = URI.create(url.trim());
            String host = u.getHost();
            if (!List.of("github.com", "raw.githubusercontent.com").contains(host)) {
                throw new IllegalArgumentException("Only GitHub URLs allowed");
            }
            String raw = toRawUrl(u);
            return web.get().uri(raw).retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(10));
        } catch (Exception e) {
            return "> ️ README 불러오기 실패: " + e.getMessage();
        }
    }

    private String toRawUrl(URI u) {
        String s = u.toString();
        if (u.getHost().equals("raw.githubusercontent.com")) return s;

        var parts = s.split("/blob/");
        if (parts.length == 2) {
            String left = parts[0].replace("https://github.com/", "https://raw.githubusercontent.com/");
            return left + "/" + parts[1];
        }

        return s.replace("https://github.com/", "https://raw.githubusercontent.com/");
    }
}
