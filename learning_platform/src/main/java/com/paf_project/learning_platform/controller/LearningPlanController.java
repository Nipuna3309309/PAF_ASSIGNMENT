package com.paf_project.learning_platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf_project.learning_platform.model.LearningPlan;
import com.paf_project.learning_platform.service.LearningPlanService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningplans")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return learningPlanService.createPlan(plan);
    }

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getPlansByUser(@PathVariable String userId) {
        return learningPlanService.getPlansByUser(userId);
    }

    @GetMapping("/{id}")
    public Optional<LearningPlan> getPlanById(@PathVariable String id) {
        return learningPlanService.getPlanById(id);
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan updatedPlan) {
        return learningPlanService.updatePlan(id, updatedPlan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable String id) {
        learningPlanService.deletePlan(id);
    }

        @GetMapping("/all")
public List<LearningPlan> getAllLearningPlans() {
    return learningPlanService.getAllLearningPlans();
}

}
