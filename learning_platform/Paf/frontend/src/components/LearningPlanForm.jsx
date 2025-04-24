import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, TextField, Button, Box, Typography, Paper, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormControlLabel, Checkbox } from '@mui/material';
import debounce from 'lodash/debounce';

const LearningPlanCreation = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState([]);
  const [taskOption, setTaskOption] = useState('manual');
  const [noCoursesMessage, setNoCoursesMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLearningPlan({ ...learningPlan, [e.target.name]: e.target.value });
  };

  const fetchCourses = debounce((skill) => {
    if (skill) {
      axios.get(`http://localhost:8085/api/courses/skill/${skill}`)
        .then((response) => {
          setCourses(response.data);
          setNoCoursesMessage('');
        })
        .catch(() => {
          setCourses([]);
          setNoCoursesMessage('No courses found for this skill.');
        });
    } else {
      setCourses([]);
      setNoCoursesMessage('');
    }
  }, 500);

  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    fetchCourses(value);
  };

  const handleTopicChange = (e) => {
    setTopicInput(e.target.value);
  };

  const addSkill = () => {
    if (skillInput && !learningPlan.skills.includes(skillInput)) {
      setLearningPlan({
        ...learningPlan,
        skills: [...learningPlan.skills, skillInput],
      });
      setSkillInput('');
      setCourses([]);
      setSelectedCourse('');
    }
  };

  const addTopic = () => {
    if (topicInput && !learningPlan.topics.includes(topicInput)) {
      setLearningPlan({
        ...learningPlan,
        topics: [...learningPlan.topics, topicInput],
      });
      setTopicInput('');
    }
  };

  const handleGenerateAITasks = () => {
    const generatedTasks = [
      { name: 'AI Task 1', description: 'Automatically generated task 1' },
      { name: 'AI Task 2', description: 'Automatically generated task 2' },
    ];
    setAiGeneratedTasks(generatedTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const learningPlanWithTasks = {
      ...learningPlan,
      tasks: taskOption === 'manual' ? tasks : aiGeneratedTasks,
    };

    setIsLoading(true);

    axios.post('http://localhost:8085/api/learningplans', learningPlanWithTasks)
      .then(() => {
        toast.success('Learning plan created successfully!');
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
        setTasks([]);
        setAiGeneratedTasks([]);
        setSkillInput('');
        setTopicInput('');
        setNoCoursesMessage('');
        setSelectedCourse('');
        navigate('/');
      })
      .catch(() => {
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
          <TextField fullWidth label="Title" name="title" value={learningPlan.title} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Background" name="background" value={learningPlan.background} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Scope" name="scope" value={learningPlan.scope} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Resource Link" name="resourceLink" value={learningPlan.resourceLink} onChange={handleInputChange} sx={{ mb: 2 }} />

          <TextField fullWidth label="Add Skills" value={skillInput} onChange={handleSkillChange} sx={{ mb: 2 }} />
          <Button variant="contained" onClick={addSkill} sx={{ mb: 2 }}>Add Skill</Button>
          <Box sx={{ mb: 2 }}>{learningPlan.skills.map((skill, index) => (<Typography key={index}>{skill}</Typography>))}</Box>

          {courses.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Suggested Courses</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCourse(selected);
                  if (!learningPlan.suggestedCourses.includes(selected)) {
                    setLearningPlan({
                      ...learningPlan,
                      suggestedCourses: [...learningPlan.suggestedCourses, selected],
                    });
                  }
                }}
              >
                {courses.map((course, index) => (
                  <MenuItem key={index} value={course}>{course}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {noCoursesMessage && <Typography color="error">{noCoursesMessage}</Typography>}
          {learningPlan.suggestedCourses.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Added Courses:</Typography>
              {learningPlan.suggestedCourses.map((course, index) => (
                <Typography key={index}>• {course}</Typography>
              ))}
            </Box>
          )}

          <TextField fullWidth label="Add Topic" value={topicInput} onChange={handleTopicChange} sx={{ mb: 2 }} />
          <Button variant="contained" onClick={addTopic} sx={{ mb: 2 }}>Add Topic</Button>
          <Box sx={{ mb: 2 }}>{learningPlan.topics.map((topic, index) => (<Typography key={index}>{topic}</Typography>))}</Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Task Creation Method</InputLabel>
              <Select value={taskOption} onChange={(e) => setTaskOption(e.target.value)}>
                <MenuItem value="manual">Manual Task Creation</MenuItem>
                <MenuItem value="ai">AI-Generated Tasks</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {taskOption === 'manual' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6">Add Manual Task</Typography>
              <TextField fullWidth label="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth label="Task Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} sx={{ mb: 2 }} />
              <Button variant="contained" onClick={() => {
                if (taskName && taskDescription) {
                  const newTask = { name: taskName, description: taskDescription };
                  setTasks([...tasks, newTask]);
                  setTaskName('');
                  setTaskDescription('');
                }
              }}>Add Task</Button>
              <Box sx={{ mt: 2 }}>{tasks.map((task, index) => (<Box key={index} sx={{ mb: 1 }}><Typography>{task.name}: {task.description}</Typography></Box>))}</Box>
            </Box>
          )}

          {taskOption === 'ai' && (
            <Box sx={{ mb: 3 }}>
              <Button variant="contained" onClick={handleGenerateAITasks}>Generate AI Tasks</Button>
              <Box sx={{ mt: 2 }}>{aiGeneratedTasks.length > 0 ? (
                aiGeneratedTasks.map((task, index) => (
                  <Box key={index} sx={{ mb: 1 }}><Typography>{task.name}: {task.description}</Typography></Box>
                ))
              ) : (
                <Typography>No AI tasks generated yet.</Typography>
              )}</Box>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <FormControlLabel control={<Checkbox checked={learningPlan.deadlineEnabled} onChange={(e) => setLearningPlan({ ...learningPlan, deadlineEnabled: e.target.checked })} />} label="Set Deadline" />
            {learningPlan.deadlineEnabled && (
              <>
                <TextField label="Start Date" type="date" fullWidth value={learningPlan.startDate} onChange={(e) => setLearningPlan({ ...learningPlan, startDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                <TextField label="End Date" type="date" fullWidth value={learningPlan.endDate} onChange={(e) => setLearningPlan({ ...learningPlan, endDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading || !learningPlan.skills.length}>
              {isLoading ? <CircularProgress size={24} /> : 'Create Learning Plan'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LearningPlanCreation;
