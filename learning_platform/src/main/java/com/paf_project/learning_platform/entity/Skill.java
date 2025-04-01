package com.paf_project.learning_platform.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Skill {
    @Id
    private String id; // MongoDB will automatically assign an id if you don't manually assign one
    private String name;

    // Constructor to initialize Skill with just the name
    public Skill(String name) {
        this.name = name;
    }
}
