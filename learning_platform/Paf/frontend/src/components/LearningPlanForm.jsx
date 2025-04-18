import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LearningPlanCreation() {
  const [learningPlan, setLearningPlan] = useState({
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({ ...learningPlan, [name]: value });
  };

  // Handle skill input and fetch courses based on skill
  const handleSkillChange = (e) => {
    const skill = e.target.value;
    setSkillInput(skill);

    // Fetch suggested courses for the entered skill
    if (skill.trim() !== '') {
      axios
        .get(`http://localhost:8085/api/courses/skill/${skill}`)
        .then((response) => {
          if (response.data.length === 0) {
            setNoCoursesMessage('No suggested courses found for this skill.');
          } else {
            setNoCoursesMessage('');
          }
          setCourses(response.data); // this will be a list of course names
        })
        .catch((error) => {
          console.log(error);
          setCourses([]);
          setNoCoursesMessage('Error fetching courses.');
        });
    } else {
      setCourses([]);
      setNoCoursesMessage('');
    }
  };

  // Add skill to the learning plan
  const addSkill = () => {
    if (skillInput.trim() !== '') {
      setLearningPlan({
        ...learningPlan,
        skills: [...learningPlan.skills, skillInput],
      });
      setSkillInput('');
      setCourses([]); // Clear previous course suggestions
    }
  };

  // Add topic to the learning plan
  const addTopic = () => {
    setLearningPlan({
      ...learningPlan,
      topics: [...learningPlan.topics, { name: topicInput, completed: false }],
    });
    setTopicInput('');
  };

  // Toggle deadline enabled/disabled
  const handleDeadlineToggle = () => {
    setLearningPlan({
      ...learningPlan,
      deadlineEnabled: !learningPlan.deadlineEnabled,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    axios
      .post('http://localhost:8085/api/learningplans', learningPlan)
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
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Create Learning Plan</h1>
      {showMessage && <div>Learning Plan created successfully!</div>}

      <form>
        {/* Learning Plan Name */}
        <input
          type="text"
          name="title"
          placeholder="Learning Plan Name"
          value={learningPlan.title}
          onChange={handleInputChange}
        />
        <textarea
          name="background"
          placeholder="Background"
          value={learningPlan.background}
          onChange={handleInputChange}
        />
        <textarea
          name="scope"
          placeholder="Scope"
          value={learningPlan.scope}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="resourceLink"
          placeholder="Resource Link"
          value={learningPlan.resourceLink}
          onChange={handleInputChange}
        />

        {/* Skill Input */}
        <div>
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillChange}
            placeholder="Enter skill"
          />
          <button type="button" onClick={addSkill}>
            Add Skill
          </button>
        </div>

        {/* Display added skills */}
        <div>
          {learningPlan.skills.map((skill, index) => (
            <span key={index} style={{ marginRight: '10px' }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Suggested Courses Dropdown */}
        {courses.length > 0 && (
          <div>
            <label>Suggested Courses</label>
            <select
              onChange={(e) =>
                setLearningPlan({
                  ...learningPlan,
                  suggestedCourses: [
                    ...learningPlan.suggestedCourses,
                    e.target.value,
                  ],
                })
              }
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

        {/* No courses message */}
        {noCoursesMessage && <p>{noCoursesMessage}</p>}

        {/* Deadline Option */}
        <div>
          <input
            type="checkbox"
            checked={learningPlan.deadlineEnabled}
            onChange={handleDeadlineToggle}
          />
          <label>Enable Deadline</label>
        </div>

        {/* Deadline Input Fields */}
        {learningPlan.deadlineEnabled && (
          <div>
            <input
              type="date"
              name="startDate"
              value={learningPlan.startDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="endDate"
              value={learningPlan.endDate}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Topic Input */}
        <div>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter Topic"
          />
          <button type="button" onClick={addTopic}>
            Add Topic
          </button>
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit}>
          Create Learning Plan
        </button>
      </form>
    </div>
  );
}

export default LearningPlanCreation;
