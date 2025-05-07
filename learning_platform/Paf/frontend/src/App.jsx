import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavigationBar';  // Importing Navbar
import LearningPlanList from './components/LearningPlanList';
import LearningPlanForm from './components/LearningPlanForm';
import LearningPlanDetail from './components/LearningPlanDetail';
import CourseList from './components/CourseList';  // New component
import CourseDetail from './components/CourseDetail';  // New component
import CourseForm from './components/CourseForm';  // New component (optional for creating courses)

function App() {
  const userId = '12345'; // Mock user ID, replace with actual logic if necessary

  return (
    <Router>
      
      <Routes>
        {/* Learning Plan Routes */}
        <Route path="/" element={<LearningPlanList userId={userId} />} />
        <Route path="/create" element={<LearningPlanForm />} />
        <Route path="/plan/:id" element={<LearningPlanDetail />} />
        
        {/* Course Routes */}
        <Route path="/courses" element={<CourseList />} />  {/* List of courses */}
        <Route path="/courses/create" element={<CourseForm />} />  {/* Create a new course */}
        <Route path="/courses/:id" element={<CourseDetail />} />  {/* View course details */}
      </Routes>
    </Router>
  );
}

export default App;
