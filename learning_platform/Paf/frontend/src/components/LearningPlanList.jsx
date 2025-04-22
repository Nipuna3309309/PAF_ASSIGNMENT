import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningPlansByUser, deleteLearningPlan } from '../api/learningPlanApi';

const LearningPlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

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
    loadPlans(); // refresh list
  };
  

  useEffect(() => {
    if (userId) {
      loadPlans();
    }
  }, [userId]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Learning Plans</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/create')}
        >
          + Create Learning Plan
        </button>
      </div>

      <ul className="space-y-2">
        {plans.map((plan) => (
          <li
            key={plan._id}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >
            <div>
              <strong>{plan.title}</strong>: {plan.description}
            </div>
            <button
              onClick={() => handleDelete(plan._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPlanList;
