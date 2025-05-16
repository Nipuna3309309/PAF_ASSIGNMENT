package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.model.CommentLike;

import java.util.List;
import java.util.Optional;

public interface CommentLikeRepo extends MongoRepository<CommentLike, String> {
    List<CommentLike> findByCommentId(String commentId);

    long countByCommentId(String commentId);

    Optional<CommentLike> findByCommentIdAndUserId(String commentId, String userId);

    void deleteByCommentIdAndUserId(String commentId, String userId);
}