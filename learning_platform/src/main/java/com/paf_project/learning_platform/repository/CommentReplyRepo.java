package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.model.CommentReply;

import java.util.List;

public interface CommentReplyRepo extends MongoRepository<CommentReply, String> {
    List<CommentReply> findByCommentId(String commentId);

    long countByCommentId(String commentId);
}