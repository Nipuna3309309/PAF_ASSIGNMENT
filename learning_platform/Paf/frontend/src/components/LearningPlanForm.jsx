import React, { useState } from 'react';
import axios from 'axios';
import "tailwindcss";

function LearningPlanCreation() {
  const [learningPlan, setLearningPlan] = useState({
    userId: '12345',
    title: '',
    background: '',
    scope: '',
    resourceLink: '',
    skills: [],
    suggestedCourses: [],
    deadlineEnabled: false,
    startDate: '',
    endDate: '',
    topics: [],
  });
  const [courses, setCourses] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [noCoursesMessage, setNoCoursesMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({ ...learningPlan, [name]: value });
  };

  const handleSkillChange = (e) => {
    const skill = e.target.value;
    setSkillInput(skill);

    if (skill.trim() !== '') {
      axios
        .get(`http://localhost:8085/api/courses/skill/${skill}`)
        .then((response) => {
          if (response.data.length === 0) {
            setNoCoursesMessage('No suggested courses found for this skill.');
          } else {
            setNoCoursesMessage('');
          }

          const uniqueCourses = [...new Set(response.data)];
          setCourses(uniqueCourses);
        })
        .catch(() => {
          setCourses([]);
          setNoCoursesMessage('Error fetching courses.');
        });
    } else {
      setCourses([]);
      setNoCoursesMessage('');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() !== '' && !learningPlan.skills.includes(skillInput)) {
      setLearningPlan({
        ...learningPlan,
        skills: [...learningPlan.skills, skillInput],
      });
      setSkillInput('');
      setCourses([]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setLearningPlan({
      ...learningPlan,
      skills: learningPlan.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const addTopic = () => {
    if (topicInput.trim() !== '') {
      setLearningPlan({
        ...learningPlan,
        topics: [...learningPlan.topics, { name: topicInput, completed: false }],
      });
      setTopicInput('');
    }
  };

  const removeCourse = (courseToRemove) => {
    setLearningPlan({
      ...learningPlan,
      suggestedCourses: learningPlan.suggestedCourses.filter(
        (course) => course !== courseToRemove
      ),
    });
  };

  const handleDeadlineToggle = () => {
    setLearningPlan({
      ...learningPlan,
      deadlineEnabled: !learningPlan.deadlineEnabled,
    });
  };

  const handleSubmit = () => {
    const suggestedCoursesObjects = learningPlan.suggestedCourses.map(course => ({ name: course }));

    const learningPlanWithCourses = {
      ...learningPlan,
      suggestedCourses: suggestedCoursesObjects,
    };

    axios
      .post('http://localhost:8085/api/learningplans', learningPlanWithCourses)
      .then(() => {
        setShowMessage(true);
        setLearningPlan({
          title: '',
          background: '',
          scope: '',
          resourceLink: '',
          skills: [],
          suggestedCourses: [],
          deadlineEnabled: false,
          startDate: '',
          endDate: '',
          topics: [],
        });
      })
      .catch((error) => {
        console.log('Error:', error.response?.data || error.message);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Learning Plan</h1>
      {showMessage && <div className="mb-4 text-green-600 font-medium">✅ Learning Plan created successfully!</div>}

      <form className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Learning Plan Name"
          value={learningPlan.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        />
        <textarea
          name="background"
          placeholder="Background"
          value={learningPlan.background}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        />
        <textarea
          name="scope"
          placeholder="Scope"
          value={learningPlan.scope}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          name="resourceLink"
          placeholder="Resource Link"
          value={learningPlan.resourceLink}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Skills */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillChange}
            placeholder="Enter skill"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={addSkill}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Add Skill
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {learningPlan.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 text-red-500 hover:text-red-700">
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Suggested Courses */}
        {courses.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Suggested Courses</label>
            <select
              onChange={(e) => {
                const selectedCourse = e.target.value;
                if (
                  selectedCourse &&
                  !learningPlan.suggestedCourses.includes(selectedCourse)
                ) {
                  setLearningPlan({
                    ...learningPlan,
                    suggestedCourses: [
                      ...learningPlan.suggestedCourses,
                      selectedCourse,
                    ],
                  });
                }
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select a course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
        )}

        {learningPlan.suggestedCourses.map((course, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            {course}
            <button onClick={() => removeCourse(course)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        ))}

        {noCoursesMessage && <p className="text-red-500">{noCoursesMessage}</p>}

        {/* Deadline */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={learningPlan.deadlineEnabled}
            onChange={handleDeadlineToggle}
          />
          <label className="text-sm">Enable Deadline</label>
        </div>

        {learningPlan.deadlineEnabled && (
          <div className="flex gap-4">
            <input
              type="date"
              name="startDate"
              value={learningPlan.startDate}
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            />
            <input
              type="date"
              name="endDate"
              value={learningPlan.endDate}
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            />
          </div>
        )}

        {/* Topics */}
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter Topic"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={addTopic}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Add Topic
          </button>
        </div>

        {learningPlan.topics.map((topic, index) => (
          <div key={index} className="text-gray-700">{topic.name}</div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Create Learning Plan
        </button>
      </form>
    </div>
  );
}

export default LearningPlanCreation;
