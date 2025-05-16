const BASE_URL = 'http://localhost:8070/api/learningplans';

export const createLearningPlan = async (plan) => {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  });
  return res.json();
};

export const getMyLearningPlans = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  return res.json();
};

export const getLearningPlanById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const updateLearningPlan = async (id, plan) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  });
  return res.json();
};

export const deleteLearningPlan = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};


