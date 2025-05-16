package com.paf_project.learning_platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_project.learning_platform.model.CommentReply;
import com.paf_project.learning_platform.model.User;
import com.paf_project.learning_platform.repository.CommentReplyRepo;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.List;

@Service
public class CommentReplyService {
    @Autowired
    private CommentReplyRepo commentReplyRepo;

    @Autowired
    private UserRepository userRepository;

    public CommentReply createReply(String commentId, String userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentReply reply = new CommentReply();
        reply.setCommentId(commentId);
        reply.setUserId(userId);
        reply.setUserName(user.getName());
        reply.setUserImage(user.getImageUrl());
        reply.setContent(content);
        return commentReplyRepo.save(reply);
    }

    public CommentReply updateReply(String replyId, String content) {
        CommentReply reply = commentReplyRepo.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));
        reply.setContent(content);
        reply.setEdited(true);
        return commentReplyRepo.save(reply);
    }

    public void deleteReply(String replyId) {
        commentReplyRepo.deleteById(replyId);
    }

    public List<CommentReply> getRepliesByCommentId(String commentId) {
        return commentReplyRepo.findByCommentId(commentId);
    }

    public long getReplyCount(String commentId) {
        return commentReplyRepo.countByCommentId(commentId);
    }
}