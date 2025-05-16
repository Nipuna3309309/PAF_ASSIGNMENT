package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import com.paf_project.learning_platform.model.Like;

import java.util.List;
import java.util.Optional;

public interface LikeRepo extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);

    long countByPostId(String postId);

    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    @Transactional
    void deleteByPostIdAndUserId(String postId, String userId);
}