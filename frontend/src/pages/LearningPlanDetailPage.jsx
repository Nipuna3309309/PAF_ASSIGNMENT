import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningPlanById } from '../services/learningPlanService';

const LearningPlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      const data = await getLearningPlanById(planId);
      setPlan(data);

      // Initialize task status
      const initialStatus = {};
      data.tasks.forEach((_, idx) => {
        initialStatus[idx] = false;
      });
      setTaskStatus(initialStatus);
    };

    fetchPlan();
  }, [planId]);

  const handleCheck = (idx) => {
    setTaskStatus(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const progress = plan?.tasks.length
    ? (Object.values(taskStatus).filter(Boolean).length / plan.tasks.length) * 100
    : 0;

  if (!plan) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline mb-6"
      >
        ← Back to Learning Plans
      </button>

      <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
      <p className="text-gray-700 mb-2">{plan.background}</p>
      <p className="text-gray-600 mb-4">{plan.scope}</p>

      <div className="mb-6">
        <p><strong>Skills:</strong> {plan.skills.join(', ')}</p>
        <p><strong>Topics:</strong> {plan.topics.join(', ')}</p>
      </div>

      <div className="mb-6">
        <p><strong>Duration:</strong> {plan.startDate} to {plan.endDate}</p>
      </div>

      <div className="mb-8">
        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-center text-sm text-gray-600">{Math.round(progress)}% Completed</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Tasks</h3>
      <div className="space-y-4">
        {plan.tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={taskStatus[idx] || false}
              onChange={() => handleCheck(idx)}
              className="w-5 h-5"
            />
            <div>
              <h4 className="font-bold">{task.taskName}</h4>
              <p className="text-gray-600">{task.taskDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlanDetailPage;
