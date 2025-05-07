package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String description;
    private List<String> imageUrls; // 1-3 images
    private String videoUrl; // 1 video (null if images exist)
    private Date createdAt = new Date();

    public enum MediaType { IMAGE, VIDEO }
    private MediaType mediaType;
}