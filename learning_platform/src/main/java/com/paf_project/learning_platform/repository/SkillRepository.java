package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.paf_project.learning_platform.model.Skill;

import java.util.List;

public interface SkillRepository extends MongoRepository<Skill, String> {
    List<Skill> findByUserId(String userId);
}
