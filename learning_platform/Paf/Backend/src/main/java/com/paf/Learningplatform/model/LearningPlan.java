package com.paf.Learningplatform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "learningPlans")
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String title;
    private String background;
    private String scope;
    private String resourceLink;
    private List<String> skills;
    private List<Course> suggestedCourses; // List of courses based on skills
    private boolean deadlineEnabled;
    private String startDate;
    private String endDate;
    private List<Topic> topics; // Topics related to the learning plan
}
