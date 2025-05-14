package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.model.LearningPlan;

import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
}
