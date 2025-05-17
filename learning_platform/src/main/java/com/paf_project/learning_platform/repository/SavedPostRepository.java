package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_project.learning_platform.model.SavedPost;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPostRepository extends MongoRepository<SavedPost, String> {
    List<SavedPost> findByUserId(String userId);

    Optional<SavedPost> findByUserIdAndPostId(String userId, String postId);

    void deleteByUserIdAndPostId(String userId, String postId);

    boolean existsByUserIdAndPostId(String userId, String postId);
}