package com.paf_project.learning_platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.paf_project.learning_platform.model.Course;
import com.paf_project.learning_platform.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/api/dsrcourses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @GetMapping
    public List<Course> getAll() {
        return courseService.getAllCourses();
    }

    @GetMapping("/search")
    public List<Course> search(@RequestParam String q) {
        return courseService.searchCourses(q);
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    public Course enroll(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.enrollUser(courseId, userId);
    }

    @PostMapping("/{courseId}/complete/{userId}")
    public Course complete(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.markCompleted(courseId, userId);
    }

    @PostMapping("/{courseId}/viewed/{userId}")
    public Course markLessonViewed(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.markLessonViewed(courseId, userId);
    }

    @PostMapping("/{courseId}/download/{userId}/{resourceName}")
    public Course markResourceDownloaded(@PathVariable String courseId, @PathVariable String userId, @PathVariable String resourceName) {
        return courseService.markResourceDownloaded(courseId, userId, resourceName);
    }

    @GetMapping("/{courseId}/user/{userId}")
    public Course getCourseForUser(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.getCourseDetailsForUser(courseId, userId);
    }

    @GetMapping("/enrolled/{userId}")
    public List<Course> getEnrolledCourses(@PathVariable String userId) {
        return courseService.getEnrolledCourses(userId);
    }

     @DeleteMapping("/{courseId}/enroll/{userId}")
    public Course unenroll(@PathVariable String courseId, @PathVariable String userId) {
        return courseService.unenrollUser(courseId, userId);
    }
    
}
