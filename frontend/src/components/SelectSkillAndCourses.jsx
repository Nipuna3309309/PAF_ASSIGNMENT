// src/components/SelectSkillAndCourses.jsx

import React, { useState } from 'react';

const SelectSkillAndCourses = ({ skills, setSkills, courses, selectedCourses, setSelectedCourses }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSelectCourse = (courseId) => {
    if (!selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Add Skills</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Skill name"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleAddSkill} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Skill
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="flex justify-between items-center mb-2 border p-2 rounded">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.category}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedCourses.includes(course.id)}
                onChange={() => handleSelectCourse(course.id)}
              />
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default SelectSkillAndCourses;
