package com.paf.Learningplatform.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf.Learningplatform.model.LearningPlan;
import com.paf.Learningplatform.service.LearningPlanService;

@RestController
@RequestMapping("/api/learningplans")
@CrossOrigin
public class LearningPlanController {
    @Autowired
    private LearningPlanService service;

    @PostMapping
    public ResponseEntity<LearningPlan> create(@RequestBody LearningPlan plan) {
        return new ResponseEntity<>(service.create(plan), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<LearningPlan>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> update(@PathVariable String id, @RequestBody LearningPlan plan) {
        return ResponseEntity.ok(service.update(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
