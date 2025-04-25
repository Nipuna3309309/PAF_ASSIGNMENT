package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired private NotificationRepository notificationRepo;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationRepo.findByRecipientIdOrderByTimestampDesc(userId);
    }

    @PutMapping("/{id}/read")
    public String markRead(@PathVariable String id) {
        Notification n = notificationRepo.findById(id).orElseThrow();
        n.setRead(true);
        notificationRepo.save(n);
        return "Marked as read.";
    }

    @PatchMapping("/mark-all-read/{userId}")
    public String markAllAsRead(@PathVariable String userId) {
        List<Notification> notifications = notificationRepo.findByRecipientIdAndReadFalse(userId);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepo.saveAll(notifications);
        return "All marked as read.";
    }

}
