package com.paf.Learningplatform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paf.Learningplatform.model.LearningPlan;
import com.paf.Learningplatform.model.Task;
import com.paf.Learningplatform.repository.LearningPlanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    public LearningPlan create(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlan> getByUser(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    public LearningPlan addManualTask(String id, String taskName, String taskDescription) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.getTasks().add(new Task(taskName, taskDescription, false, false));
        return learningPlanRepository.save(plan);
    }

    public LearningPlan addAiGeneratedTasks(String id, List<Task> aiTasks) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.getTasks().addAll(aiTasks);
        return learningPlanRepository.save(plan);
    }

    public LearningPlan update(String id, LearningPlan updated) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.setTitle(updated.getTitle());
        plan.setBackground(updated.getBackground());
        plan.setScope(updated.getScope());
        plan.setResourceLink(updated.getResourceLink());
        plan.setSkills(updated.getSkills());
        plan.setSuggestedCourses(updated.getSuggestedCourses());
        plan.setDeadlineEnabled(updated.isDeadlineEnabled());
        plan.setStartDate(updated.getStartDate());
        plan.setEndDate(updated.getEndDate());
        plan.setTopics(updated.getTopics());
        plan.setTasks(updated.getTasks());
        return learningPlanRepository.save(plan);
    }

    public void delete(String id) {
        learningPlanRepository.deleteById(id);
    }

    public LearningPlan getById(String id) {
        return learningPlanRepository.findById(id).orElse(null);
    }

    public List<Task> generateAiTasks(String topic) {
        String prompt = "Generate 5 step-by-step learning tasks for this topic: " + topic;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions", entity,
                (Class<Map<String, Object>>) (Class<?>) Map.class);

        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = (String) message.get("content");

        List<Task> tasks = new ArrayList<>();
        for (String line : content.split("\\n")) {
            line = line.trim();
            if (!line.isEmpty() && Character.isDigit(line.charAt(0))) {
                line = line.replaceFirst("^\\d+\\.?\\)?\\s*", "");
                tasks.add(Task.aiTask(line, "AI-generated"));
            }
        }

        return tasks;
    }
}
