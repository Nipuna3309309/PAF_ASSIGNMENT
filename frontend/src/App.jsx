import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LearningPlanPage from './pages/LearningPlanPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import AIGenerateTasksPage from "./pages/AIGenerateTasksPage";
import ShareLearningPlan from './pages/ShareLearningPlan';
function App() {
  return (
    <>
        <Routes>
          <Route path="/certificate/:courseId" element={<CertificatePage />} />
          <Route path="/learning-progress" element={<LearningProgressPage />} />
          <Route path="/my-course/:courseId" element={<MyCourseDetail />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

           <Route path="/learningplan" element={<LearningPlanPage />} />
          <Route path="/learningplan/view/:planId" element={<LearningPlanDetailPage />} />
          <Route path="/aigenerate-tasks" element={<AIGenerateTasksPage />} />
          <Route path="/learningplan/share/:planId" element={<ShareLearningPlan />} />

        </Routes>
    </>
  );
}

export default App;
