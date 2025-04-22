import React, { useState } from 'react';
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

          // Remove duplicates
          const uniqueCourses = [...new Set(response.data)];
          setCourses(uniqueCourses);
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
  // Ensure suggestedCourses contains the actual course objects
  const suggestedCoursesObjects = courses.map(course => ({ name: course }));

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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Create Learning Plan</h1>
      {showMessage && <div style={{ color: 'green' }}>Learning Plan created successfully!</div>}

      <form>
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

        {/* Skills */}
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

        <div>
          {learningPlan.skills.map((skill, index) => (
            <span key={index} style={{ marginRight: '10px' }}>
              {skill}{' '}
              <button type="button" onClick={() => removeSkill(skill)}>
                ❌
              </button>
            </span>
          ))}
        </div>

        {/* Courses */}
        {courses.length > 0 && (
          <div>
            <label>Suggested Courses</label>
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
          <div key={index}>
            {course}{' '}
            <button type="button" onClick={() => removeCourse(course)}>
              ❌
            </button>
          </div>
        ))}

        {noCoursesMessage && <p style={{ color: 'red' }}>{noCoursesMessage}</p>}

        {/* Deadline Toggle */}
        <div>
          <input
            type="checkbox"
            checked={learningPlan.deadlineEnabled}
            onChange={handleDeadlineToggle}
          />
          <label>Enable Deadline</label>
        </div>

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

        {/* Topics */}
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

        {learningPlan.topics.map((topic, index) => (
          <div key={index}>{topic.name}</div>
        ))}

        <button type="button" onClick={handleSubmit}>
          Create Learning Plan
        </button>
      </form>
    </div>
  );
}

export default LearningPlanCreation;
