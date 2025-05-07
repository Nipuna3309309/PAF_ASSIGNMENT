package com.paf.Learningplatform.service;

import com.paf.Learningplatform.model.Course;
import com.paf.Learningplatform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public Course create(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course update(String id, Course updatedCourse) {
        Course course = getCourseById(id);
        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setInstructor(updatedCourse.getInstructor());
        course.setCategory(updatedCourse.getCategory());
        course.setLevel(updatedCourse.getLevel());
        course.setLanguage(updatedCourse.getLanguage());
        course.setDuration(updatedCourse.getDuration());
        course.setName(updatedCourse.getName());
        course.setSkill(updatedCourse.getSkill());
        course.setResourceLink(updatedCourse.getResourceLink());

        return courseRepository.save(course);
    }

    public void delete(String id) {
        courseRepository.deleteById(id);
    }

    public List<Course> getCoursesBySkills(List<String> skills) {
        return courseRepository.findAll().stream()
                .filter(course -> skills.contains(course.getSkill()))
                .toList();
    }
}
