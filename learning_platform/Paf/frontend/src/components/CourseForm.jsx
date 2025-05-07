import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CourseForm() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: '',
    language: '',
    duration: '',
    name: '',
    skill: '',
    resourceLink: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send POST request to create a new course
    axios.post('http://localhost:8085/api/courses', course)
      .then((response) => {
        navigate('/courses'); // Redirect to the courses list after successful creation
      })
      .catch((error) => {
        console.error('There was an error creating the course!', error);
      });
  };

  return (
    <div>
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="instructor"
          placeholder="Instructor"
          value={course.instructor}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={course.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="level"
          placeholder="Level"
          value={course.level}
          onChange={handleChange}
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={course.language}
          onChange={handleChange}
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={course.duration}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Module Name"
          value={course.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="skill"
          placeholder="Skill"
          value={course.skill}
          onChange={handleChange}
        />
        <input
          type="url"
          name="resourceLink"
          placeholder="Resource Link"
          value={course.resourceLink}
          onChange={handleChange}
        />
        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={course.image}
          onChange={handleChange}
        />
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}

export default CourseForm;
