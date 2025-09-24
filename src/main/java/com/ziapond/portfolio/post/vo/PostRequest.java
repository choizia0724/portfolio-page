package com.ziapond.portfolio.post.vo;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String contentMd;
    private String readmeUrl;
}