import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Typography, TextField,
  Chip, Autocomplete, Checkbox, FormControlLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Card, Divider, Grid
} from '@mui/material';
import axios from 'axios';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editablePlan, setEditablePlan] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [suggestedCoursesForSkill, setSuggestedCoursesForSkill] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8085/api/learningplans/plan/${id}`)
      .then((res) => {
        setPlan(res.data);
        setEditablePlan(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching plan:', err);
        setLoading(false);
      });
  }, [id]);

  const handleEditToggle = () => setEditMode(true);
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditablePlan(plan);
    setNewSkill('');
    setSelectedCourses([]);
    setSuggestedCoursesForSkill([]);
  };

  const handleInputChange = (field, value) => {
    setEditablePlan(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = editablePlan.skills.filter(skill => skill !== skillToRemove);
    const updatedCourses = editablePlan.suggestedCourses.filter(course => course.skill !== skillToRemove);
    setEditablePlan({ ...editablePlan, skills: updatedSkills, suggestedCourses: updatedCourses });
  };

  const fetchSuggestedCourses = (skillName) => {
    if (!skillName) return;

    axios.get(`http://localhost:8085/api/learningplans/skill/${skillName}`)
      .then((res) => {
        setSuggestedCoursesForSkill(res.data.map(courseName => ({ name: courseName })));
      })
      .catch((err) => {
        console.error('Error fetching suggested courses:', err);
        setSuggestedCoursesForSkill([]);
      });
  };

  const handleAddSkillAndCourses = () => {
    if (!newSkill.trim()) return;

    const newSkills = [...(editablePlan.skills || []), newSkill];
    const newCourses = [
      ...(editablePlan.suggestedCourses || []),
      ...selectedCourses.map(course => ({ name: course.name, skill: newSkill }))
    ];

    setEditablePlan(prev => ({
      ...prev,
      skills: newSkills,
      suggestedCourses: newCourses
    }));

    setNewSkill('');
    setSuggestedCoursesForSkill([]);
    setSelectedCourses([]);
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...editablePlan.suggestedCourses];
    updatedCourses[index].name = value;
    setEditablePlan({ ...editablePlan, suggestedCourses: updatedCourses });
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...editablePlan.tasks];
    updatedTasks[index][field] = value;
    setEditablePlan({ ...editablePlan, tasks: updatedTasks });
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:8085/api/learningplans/${id}`, editablePlan)
      .then((res) => {
        setPlan(res.data);
        setEditMode(false);
      })
      .catch((err) => {
        console.error('Error saving plan:', err);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8085/api/learningplans/${id}`)
      .then(() => navigate('/'))
      .catch((err) => console.error('Error deleting plan:', err));
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (!plan) {
    return <Typography variant="h6" mt={4} textAlign="center">Plan not found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {!editMode ? (
        <>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>{plan.title}</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Background</Typography>
                <Typography color="text.secondary">{plan.background}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Scope</Typography>
                <Typography color="text.secondary">{plan.scope}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Resource Link</Typography>
                <Typography color="text.secondary">
                  <a href={plan.resourceLink} target="_blank" rel="noopener noreferrer">{plan.resourceLink}</a>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Duration</Typography>
                <Typography color="text.secondary">
                  {new Date(plan.startDate).toLocaleDateString()} to {new Date(plan.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {plan.skills?.map((skill, idx) => (
                <Chip key={idx} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Suggested Courses</Typography>
            <Box sx={{ ml: 2 }}>
              {plan.suggestedCourses?.map((course, idx) => (
                <Typography key={idx} sx={{ mb: 1 }}>• {course.name}</Typography>
              ))}
            </Box>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Tasks</Typography>
            <Box>
              {plan.tasks?.map((task, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography><strong>{task.name}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                  <Chip
                    label={task.completed ? "Completed" : "Not Completed"}
                    color={task.completed ? "success" : "warning"}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              ))}
            </Box>
          </Card>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleEditToggle}>Edit</Button>
            <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={handleDelete}>Delete</Button>
          </Box>
        </>
      ) : (
        <Dialog open={editMode} onClose={handleCancelEdit} fullWidth maxWidth="md">
          <DialogTitle>Edit Learning Plan</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Title"
              value={editablePlan.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            {['background', 'scope', 'resourceLink', 'startDate', 'endDate'].map(field => (
              <TextField
                key={field}
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field.includes('Date') ? 'date' : 'text'}
                value={editablePlan[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            ))}

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Skills</Typography>
              {editablePlan.skills?.map((skill, idx) => (
                <Chip key={idx} label={skill} onDelete={() => handleSkillRemove(skill)} sx={{ mr: 1, mb: 1 }} />
              ))}
              <TextField
                fullWidth
                label="New Skill"
                value={newSkill}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  fetchSuggestedCourses(e.target.value);
                }}
                sx={{ mt: 1, mb: 1 }}
              />
              <Autocomplete
                multiple
                options={suggestedCoursesForSkill}
                getOptionLabel={(option) => option.name}
                value={selectedCourses}
                onChange={(e, newValue) => setSelectedCourses(newValue)}
                renderInput={(params) => <TextField {...params} label="Select Suggested Courses" />}
              />
              <Button onClick={handleAddSkillAndCourses} variant="outlined" sx={{ mt: 1 }}>Add Skill & Courses</Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Suggested Courses</Typography>
              {editablePlan.suggestedCourses?.map((course, idx) => (
                <TextField
                  key={idx}
                  fullWidth
                  value={course.name}
                  onChange={(e) => handleCourseChange(idx, e.target.value)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>

            <Box>
              <Typography variant="h6">Tasks</Typography>
              {editablePlan.tasks?.map((task, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <TextField
                    label="Task Name"
                    fullWidth
                    value={task.name}
                    onChange={(e) => handleTaskChange(idx, 'name', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Task Description"
                    fullWidth
                    value={task.description}
                    onChange={(e) => handleTaskChange(idx, 'description', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={task.completed} onChange={(e) => handleTaskChange(idx, 'completed', e.target.checked)} />}
                    label="Completed"
                  />
                </Box>
              ))}
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default LearningPlanDetail;
