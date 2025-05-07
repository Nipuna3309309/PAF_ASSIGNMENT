package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired private CommentRepository commentRepo;  //CRUD operations for Comments
    @Autowired private PostRepository postRepo; // For fetching post that commented
    @Autowired private UserRepository userRepo; // For fetching user id
    @Autowired private NotificationRepository notificationRepo; // For creating a notification to inform post owner

    @PostMapping
    public Comment createComment(@RequestParam String postId, @RequestParam String userId, @RequestParam String content) {
        // Ensure post & user exist
        postRepo.findById(postId).orElseThrow(); // Find postId from database if not available throw a error
        User user = userRepo.findById(userId).orElseThrow(); // Find userId from database if not available throw a error

        Comment comment = new Comment();  // Create new object for comment
        comment.setPostId(postId); // Fill it with postId
        comment.setUserId(userId); // Fill it with userId
        comment.setContent(content); // Fill it  with content
        comment.setCreatedAt(new Date()); // Fill it with time

        commentRepo.save(comment); // Save to database

        // Notify post owner
        Post post = postRepo.findById(postId).get();
        if (post.getUserId() != null && !post.getUserId().equals(userId)) {  // check comment has a userId or not and userId equals to the logged user
            Notification notification = new Notification(); // Create new object for a notification
            notification.setRecipientId(post.getUserId()); // set notification to the post owner
            notification.setMessage(user.getName() + " commented on your post."); // set the userName that commented
            notificationRepo.save(notification); // Save notification to the data base
        }

        return comment;
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentRepo.findByPostId(postId);
    }

    @PutMapping("/{commentId}")
    public Comment updateComment(@PathVariable String commentId, @RequestParam String content) {
        Comment comment = commentRepo.findById(commentId).orElseThrow(); // Check comment from database using commentId. if not throw error
        comment.setContent(content); // Set new content for comment
        return commentRepo.save(comment); // save edited comment to the database
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable String commentId) {
        commentRepo.deleteById(commentId);
    }
}
