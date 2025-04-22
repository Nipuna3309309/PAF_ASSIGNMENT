import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningPlanList from './components/LearningPlanList';
import LearningPlanForm from './components/LearningPlanForm';

function App() {
  const userId = '12345'; // Replace with the actual logged-in user ID

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LearningPlanList userId={userId} />} />
        <Route path="/create" element={<LearningPlanForm />} />
      </Routes>
    </Router>
  );
}

export default App;
