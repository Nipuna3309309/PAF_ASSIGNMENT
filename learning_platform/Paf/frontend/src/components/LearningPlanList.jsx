import React, { useEffect, useState } from 'react';
import { getLearningPlansByUser, deleteLearningPlan } from '../api/learningPlanApi';

const LearningPlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);

  const loadPlans = async () => {
    try {
      const res = await getLearningPlansByUser(userId);
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const handleDelete = async (id) => {
    await deleteLearningPlan(id);
    loadPlans();
  };

  useEffect(() => {
    loadPlans();
  }, [userId]);

  return (
    <div>
      <h3>Learning Plans</h3>
      <ul>
        {plans.map((plan) => (
          <li key={plan._id}>
            <strong>{plan.title}</strong>: {plan.description}
            <button onClick={() => handleDelete(plan._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPlanList;
