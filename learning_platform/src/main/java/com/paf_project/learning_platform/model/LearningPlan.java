package com.paf_project.learning_platform.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "learningplans")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LearningPlan {
    @Id
    private String id;

    private String userId;

    private String title;
    private String background;
    private String scope;

    private List<String> skills;
    private List<String> relatedCourseIds;

    private List<String> topics;

    private List<Task> tasks;

    private String startDate;
    private String endDate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Task {
        private String taskName;
        private String taskDescription;
        private boolean completed;
    }
}
