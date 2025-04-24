import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningPlanList from './components/LearningPlanList';
import LearningPlanForm from './components/LearningPlanForm';
import LearningPlanDetail from './components/LearningPlanDetail.jsx';


function App() {
  const userId = '12345'; // Replace with the actual logged-in user ID

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LearningPlanList userId={userId} />} />
        <Route path="/create" element={<LearningPlanForm />} />
        <Route path="/plan/:id" element={<LearningPlanDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
