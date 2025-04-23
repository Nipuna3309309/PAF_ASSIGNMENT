import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid
} from '@mui/material';

const LearningPlanCreation = () => {
  const [learningPlan, setLearningPlan] = useState({
    userId:'12345',
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
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [noCoursesMessage, setNoCoursesMessage] = useState('');
  const navigate = useNavigate();

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

  const addTopic = () => {
    if (topicInput.trim() !== '') {
      setLearningPlan({
        ...learningPlan,
        topics: [...learningPlan.topics, { name: topicInput, completed: false }],
      });
      setTopicInput('');
    }
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
  
    setIsLoading(true);
  
    axios
      .post('http://localhost:8085/api/learningplans', learningPlanWithCourses)
      .then(() => {
        toast.success('Learning plan created successfully!');
        setShowMessage(true);
        setLearningPlan({
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
        navigate('/'); // 👈 Redirect to home page after success
      })
      .catch((error) => {
        console.log('Error:', error.response?.data || error.message);
        toast.error('Something went wrong. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  


  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Create Learning Plan
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Learning Plan Name"
            value={learningPlan.title}
            onChange={handleInputChange}
            name="title"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Background"
            value={learningPlan.background}
            onChange={handleInputChange}
            name="background"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Scope"
            value={learningPlan.scope}
            onChange={handleInputChange}
            name="scope"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Resource Link"
            value={learningPlan.resourceLink}
            onChange={handleInputChange}
            name="resourceLink"
            sx={{ mb: 3 }}
          />

          {/* Skills Section */}
          <Box sx={{ mb: 3 }}>
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillChange}
              placeholder="Enter Skill"
              className="border p-2 rounded w-full mb-2"
            />
            <button
              type="button"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={addSkill}
            >
              Add Skill
            </button>

            <div>
              {learningPlan.skills.map((skill, index) => (
                <span key={index} style={{ marginRight: '10px' }}>
                  {skill}{' '}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </Box>

          {/* Suggested Courses Section */}
          {courses.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Suggested Courses</label>
              <select
                className="block w-full p-2.5 border bg-gray-50 rounded-lg"
                onChange={(e) => {
                  const selectedCourse = e.target.value;
                  if (!learningPlan.suggestedCourses.includes(selectedCourse)) {
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
            </Box>
          )}

          <div>
            {learningPlan.suggestedCourses.map((course, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                {course}{' '}
                <button
                  type="button"
                  onClick={() => removeCourse(course)}
                  className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {noCoursesMessage && <p className="text-red-500">{noCoursesMessage}</p>}

          {/* Deadline Toggle */}
          <Box sx={{ mb: 3 }}>
            <input
              type="checkbox"
              checked={learningPlan.deadlineEnabled}
              onChange={handleDeadlineToggle}
              className="mr-2"
            />
            <label>Enable Deadline</label>
          </Box>

          {learningPlan.deadlineEnabled && (
            <Box sx={{ mb: 3 }}>
              <TextField
                type="date"
                fullWidth
                value={learningPlan.startDate}
                onChange={handleInputChange}
                name="startDate"
                sx={{ mb: 2 }}
              />
              <TextField
                type="date"
                fullWidth
                value={learningPlan.endDate}
                onChange={handleInputChange}
                name="endDate"
              />
            </Box>
          )}

          {/* Topics Section */}
          <Box sx={{ mb: 3 }}>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter Topic"
              className="border p-2 rounded w-full mb-2"
            />
            <button
              type="button"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={addTopic}
            >
              Add Topic
            </button>

            <div>
              {learningPlan.topics.map((topic, index) => (
                <div key={index}>{topic.name}</div>
              ))}
            </div>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !learningPlan.skills.length}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Learning Plan'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LearningPlanCreation;
