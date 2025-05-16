package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.model.Comment;
import com.paf_project.learning_platform.model.CommentLike;

import java.util.List;

public interface CommentRepo extends MongoRepository<Comment, String> {
    // List<CommentLike> findByPostId(String postId);
    List<Comment> findByPostId(String postId); // Must match what's expected

    long countByPostId(String postId);
}