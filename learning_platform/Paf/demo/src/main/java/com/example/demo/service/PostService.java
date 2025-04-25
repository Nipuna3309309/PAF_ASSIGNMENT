package com.example.demo.service;

import com.example.demo.model.Post;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface PostService {
    Post createPost(String description, MultipartFile[] mediaFiles, boolean isVideo, String userId) throws IOException;

    List<Post> getAllPosts();

    Optional<Post> getPostById(String id);

    void deletePost(String id);
}
