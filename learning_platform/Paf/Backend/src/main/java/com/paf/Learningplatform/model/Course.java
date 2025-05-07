package com.paf.Learningplatform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    private String title;
    private String description;
    private String instructor;
    private String category;
    private String level;
    private String language;
    private String duration;

    private String name; // Module name
    private String skill;
    private String resourceLink;
    private String imagePath; // URL to course image
}
