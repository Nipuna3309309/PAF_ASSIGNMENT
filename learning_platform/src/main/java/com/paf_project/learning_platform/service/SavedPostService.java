package com.paf_project.learning_platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paf_project.learning_platform.model.MediaModel;
import com.paf_project.learning_platform.model.SavedPost;
import com.paf_project.learning_platform.repository.MediaRepo;
import com.paf_project.learning_platform.repository.SavedPostRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedPostService {

    @Autowired
    private SavedPostRepository savedPostRepository;

    @Autowired
    private MediaRepo mediaRepository;

    @Transactional
    public SavedPost toggleSavePost(String userId, String postId) {
        // Check if post exists
        MediaModel post = mediaRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if post is already saved
        if (savedPostRepository.existsByUserIdAndPostId(userId, postId)) {
            // Unsave the post
            savedPostRepository.deleteByUserIdAndPostId(userId, postId);
            return null;
        } else {
            // Save the post
            SavedPost savedPost = new SavedPost();
            savedPost.setUserId(userId);
            savedPost.setPostId(postId);
            return savedPostRepository.save(savedPost);
        }
    }

    public List<MediaModel> getSavedPosts(String userId) {
        // Get all saved post IDs for the user
        List<String> savedPostIds = savedPostRepository.findByUserId(userId)
                .stream()
                .map(SavedPost::getPostId)
                .collect(Collectors.toList());

        // Fetch the actual posts
        return mediaRepository.findAllById(savedPostIds);
    }

    public boolean isPostSaved(String userId, String postId) {
        return savedPostRepository.existsByUserIdAndPostId(userId, postId);
    }

    public long getSavedPostCount(String userId) {
        return savedPostRepository.findByUserId(userId).size();
    }
}