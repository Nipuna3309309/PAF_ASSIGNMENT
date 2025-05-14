package com.paf_project.learning_platform.service;

import com.paf_project.learning_platform.model.Course;
import com.paf_project.learning_platform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepo;

    public Course createCourse(Course course) {
        return courseRepo.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepo.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Course> getEnrolledCourses(String userId) {
        return courseRepo.findByEnrolledUserIdsContains(userId);
    }

    public Course enrollUser(String courseId, String userId) {
        Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
    
        if (course.getEnrolledUserIds() == null) {
            course.setEnrolledUserIds(new ArrayList<>());
        }
        if (course.getLessonViewedMap() == null) {
            course.setLessonViewedMap(new HashMap<>());
        }
        if (course.getResourcesDownloadedMap() == null) {
            course.setResourcesDownloadedMap(new HashMap<>());
        }
    
        if (!course.getEnrolledUserIds().contains(userId)) {
            course.getEnrolledUserIds().add(userId);
            course.getLessonViewedMap().put(userId, false);
            course.getResourcesDownloadedMap().put(userId, new ArrayList<>());
            return courseRepo.save(course);
        }
    
        return course;
    }
    
    public Course markLessonViewed(String courseId, String userId) {
        Course course = courseRepo.findById(courseId).orElseThrow();
        course.getLessonViewedMap().put(userId, true);
        return courseRepo.save(course);
    }

    public Course markResourceDownloaded(String courseId, String userId, String resourceName) {
        Course course = courseRepo.findById(courseId).orElseThrow();
    
        List<String> downloaded = course.getResourcesDownloadedMap().getOrDefault(userId, new ArrayList<>());
    
        if (!downloaded.contains(resourceName)) {
            downloaded.add(resourceName);
            course.getResourcesDownloadedMap().put(userId, downloaded);
        }
    
        
        boolean lessonViewed = course.getLessonViewedMap().getOrDefault(userId, false);
        boolean allDownloaded = course.getLessons().stream()
            .flatMap(lesson -> lesson.getResources().stream())
            .allMatch(r -> downloaded.contains(r.getName()));
    
        if (lessonViewed && allDownloaded && !course.getCompletedUserIds().contains(userId)) {
            course.getCompletedUserIds().add(userId);
        }
    
        return courseRepo.save(course);
    }

    public Course markCompleted(String courseId, String userId) {
        Course course = courseRepo.findById(courseId).orElseThrow();
        if (course.getEnrolledUserIds().contains(userId) && !course.getCompletedUserIds().contains(userId)) {
            course.getCompletedUserIds().add(userId);
            return courseRepo.save(course);
        }
        return course;
    }

    public Course getCourseDetailsForUser(String courseId, String userId) {
        return courseRepo.findByIdAndEnrolledUserIdsContains(courseId, userId).orElse(null);
    }

    public Course unenrollUser(String courseId, String userId) {
        Course course = courseRepo.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getEnrolledUserIds() != null) {
            course.getEnrolledUserIds().remove(userId);
        }
        if (course.getCompletedUserIds() != null) {
            course.getCompletedUserIds().remove(userId);
        }
        if (course.getLessonViewedMap() != null) {
            course.getLessonViewedMap().remove(userId);
        }
        if (course.getResourcesDownloadedMap() != null) {
            course.getResourcesDownloadedMap().remove(userId);
        }

        return courseRepo.save(course);
    }
    

}
