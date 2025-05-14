package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.paf_project.learning_platform.model.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByEnrolledUserIdsContains(String userId);
    Optional<Course> findByIdAndEnrolledUserIdsContains(String id, String userId);
}
