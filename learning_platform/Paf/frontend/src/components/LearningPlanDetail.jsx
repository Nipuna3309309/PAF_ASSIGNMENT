import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import axios from 'axios';

const LearningPlanDetail = () => {
  const { id } = useParams(); // Extract id from URL
  const navigate = useNavigate(); // For navigation
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8085/api/learningplans/plan/${id}`)
      .then((res) => {
        setPlan(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching plan:', err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    axios.delete(`http://localhost:8085/api/learningplans/${id}`)
      .then(() => {
        // After successful deletion, navigate back to the list page
        navigate('/'); // Or wherever you want to navigate after deletion
      })
      .catch((err) => {
        console.error('Error deleting plan:', err);
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!plan) {
    return <Typography variant="h6" mt={4} textAlign="center">Plan not found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        {plan.title}
      </Typography>

      {/* Background Section */}
      <Box sx={{ borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Background
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.background}
        </Typography>
      </Box>

      {/* Scope Section */}
      <Box sx={{ mt: 3, borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Scope
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.scope}
        </Typography>
      </Box>

      {/* Skills Section */}
      <Box sx={{ mt: 3, borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Skills
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.skills && plan.skills.length > 0 ? plan.skills.join(', ') : 'No skills provided'}
        </Typography>
      </Box>

      {/* Suggested Courses Section */}
      <Box sx={{ mt: 3, borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Suggested Courses
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.suggestedCourses && plan.suggestedCourses.length > 0
            ? plan.suggestedCourses.map(course => course.name).join(', ')
            : 'No suggested courses available'}
        </Typography>
      </Box>

      {/* Deadline Section */}
      <Box sx={{ mt: 3, borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Deadline
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.deadlineEnabled ? `From ${plan.startDate} to ${plan.endDate}` : 'No deadline set'}
        </Typography>
      </Box>

      {/* Topics Section */}
      <Box sx={{ mt: 3, borderBottom: 2, borderColor: 'grey.300', pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Topics
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.topics && plan.topics.length > 0
            ? plan.topics.map(topic => topic.name).join(', ')
            : 'No topics available'}
        </Typography>
      </Box>

      {/* Tasks Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Tasks
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {plan.tasks && plan.tasks.length > 0
            ? plan.tasks.map((task, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <strong>{task.name}</strong>: {task.description} ({task.completed ? 'Completed' : 'Not Completed'})
                </Box>
              ))
            : 'No tasks available'}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { backgroundColor: '#1976d2', color: 'white' } }}
          onClick={() => window.history.back()} // Navigate back
        >
          Back to List
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
          onClick={handleDelete} // Delete the plan
        >
          Delete Learning Plan
        </Button>
      </Box>
    </Box>
  );
};

export default LearningPlanDetail;
