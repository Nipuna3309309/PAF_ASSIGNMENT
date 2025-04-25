package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired private LikeRepository likeRepo;
    @Autowired private PostRepository postRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private NotificationRepository notificationRepo;

    @PostMapping("/toggle")
    public String toggleLike(@RequestParam String postId, @RequestParam String userId) {
        Optional<Like> existing = likeRepo.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            likeRepo.delete(existing.get());
            return "Post unliked.";
        } else {
            // Validate
            Post post = postRepo.findById(postId)
                    .orElseThrow();
            User user = userRepo.findById(userId)
                    .orElseThrow();

            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);
            like.setLikedAt(new Date());
            likeRepo.save(like);

            // Notify post owner
            if (!post.getUserId().equals(userId)) {
                Notification notif = new Notification();
                notif.setRecipientId(post.getUserId());
                notif.setMessage(user.getName() + " liked your post.");
                notificationRepo.save(notif);
            }

            return "Post liked.";
        }
    }

    @GetMapping("/user/{userId}")
    public List<String> getLikedPostIds(@PathVariable String userId) {
        return likeRepo.findByUserId(userId)
                .stream()
                .map(Like::getPostId)
                .toList(); // get List<String>
    }
}
