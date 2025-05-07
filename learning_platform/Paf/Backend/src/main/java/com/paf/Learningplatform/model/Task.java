package com.paf.Learningplatform.model;

public class Task {
    private String name;
    private String description;
    private boolean completed;
    private boolean aiGenerated;

    public Task() {
        this.completed = false;
        this.aiGenerated = false;
    }

    public Task(String name, String description, boolean completed, boolean aiGenerated) {
        this.name = name;
        this.description = description;
        this.completed = completed;
        this.aiGenerated = aiGenerated;
    }

    public Task(String name, String description) {
        this.name = name;
        this.description = description;
        this.completed = false;
        this.aiGenerated = false;
    }

    public static Task aiTask(String name, String description) {
        return new Task(name, description, false, true);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isAiGenerated() {
        return aiGenerated;
    }

    public void setAiGenerated(boolean aiGenerated) {
        this.aiGenerated = aiGenerated;
    }
}
