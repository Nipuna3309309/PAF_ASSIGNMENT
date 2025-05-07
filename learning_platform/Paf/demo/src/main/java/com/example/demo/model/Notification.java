package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "notifications")
@Data

public class Notification {
    @Id
    private String id;
    private String recipientId;
    private String message;
    private boolean read = false;
    private Date timestamp = new Date();
}
