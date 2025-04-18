import axios from 'axios';

const BASE_URL = 'http://localhost:8085/api/learningplans';

export const createLearningPlan = async (plan) => {
  return await axios.post(BASE_URL, plan);
};

export const getLearningPlansByUser = async (userId) => {
  return await axios.get(`${BASE_URL}/user/${userId}`);
};

export const updateLearningPlan = async (id, updatedPlan) => {
  return await axios.put(`${BASE_URL}/${id}`, updatedPlan);
};

export const deleteLearningPlan = async (id) => {cd 
  return await axios.delete(`${BASE_URL}/${id}`);
};
