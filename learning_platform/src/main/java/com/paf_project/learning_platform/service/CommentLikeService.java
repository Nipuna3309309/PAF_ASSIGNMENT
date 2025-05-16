package com.paf_project.learning_platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.cloud.storage.Acl.User;
import com.paf_project.learning_platform.model.CommentLike;
import com.paf_project.learning_platform.repository.CommentLikeRepo;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CommentLikeService {
    @Autowired
    private CommentLikeRepo commentLikeRepo;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public synchronized CommentLike toggleLike(String commentId, String userId) {
        Optional<CommentLike> existingLike = commentLikeRepo.findByCommentIdAndUserId(commentId, userId);

        if (existingLike.isPresent()) {
            commentLikeRepo.delete(existingLike.get());
            return null;
        }

        String userName = userRepository.findById(userId)
                .map(com.paf_project.learning_platform.model.User::getName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentLike like = new CommentLike();
        like.setCommentId(commentId);
        like.setUserId(userId);
        like.setUserName(userName);
        return commentLikeRepo.save(like);
    }

    public List<CommentLike> getLikesByCommentId(String commentId) {
        return commentLikeRepo.findByCommentId(commentId);
    }

    public long getLikeCount(String commentId) {
        return commentLikeRepo.countByCommentId(commentId);
    }

    public boolean hasUserLiked(String commentId, String userId) {
        return commentLikeRepo.findByCommentIdAndUserId(commentId, userId).isPresent();
    }
}