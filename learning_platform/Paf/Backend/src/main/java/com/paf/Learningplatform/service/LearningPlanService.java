package com.paf.Learningplatform.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.Learningplatform.model.LearningPlan;
import com.paf.Learningplatform.repository.LearningPlanRepository;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository repo;

    public LearningPlan create(LearningPlan plan) {
        return repo.save(plan);
    }

    public List<LearningPlan> getByUser(String userId) {
        return repo.findByUserId(userId);
    }

    public LearningPlan update(String id, LearningPlan updated) {
        LearningPlan plan = repo.findById(id).orElseThrow();
        plan.setTitle(updated.getTitle());
        plan.setTopics(updated.getTopics());
        return repo.save(plan);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
