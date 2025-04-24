import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';

const LearningPlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Correct placement

  useEffect(() => {
    axios.get(`http://localhost:8085/api/learningplans/${userId}`)
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch learning plans:', err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Learning Plans
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create"
        sx={{ mb: 3 }}
      >
        Create New Plan
      </Button>

      {plans.length === 0 ? (
        <Typography>No learning plans found.</Typography>
      ) : (
        plans.map((plan) => (
          <Paper
            key={plan.id} // Use `id` instead of `_id`
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              '&:hover': {
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigate(`/plan/${plan.id}`)} // Navigate to plan detail
          >
            <Typography variant="h6">{plan.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {plan.background.slice(0, 100)}...
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default LearningPlanList;
