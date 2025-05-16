package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_project.learning_platform.model.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);

    long countByRecipientIdAndIsReadFalse(String recipientId);
}