package com.paf_project.learning_platform.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_project.learning_platform.model.Notification;
import com.paf_project.learning_platform.model.User;
import com.paf_project.learning_platform.repository.NotificationRepository;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(String recipientId, String senderId, String type, String content, String postId) {
        // Get sender's information
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setSenderId(senderId);
        notification.setSenderName(sender.getName());
        notification.setSenderImageUrl(sender.getImageUrl());
        notification.setType(type);
        notification.setContent(content);
        notification.setPostId(postId);
        notification.setRead(false);
        notification.onCreate();
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
} 