package com.paf.Learningplatform.dto;

import com.paf.Learningplatform.model.Course;
import com.paf.Learningplatform.model.LearningPlan;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LearningPlanWithCoursesDTO {
    private LearningPlan learningPlan;
    private List<Course> fullCourses;
}
