import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MyCourseDetail from "./pages/MyCourseDetail";
import LearningProgressPage from "./pages/LearningProgressPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CertificatePage from "./pages/CertificatePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

import LearningPlanPage from './pages/LearningPlanPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import AIGenerateTasksPage from "./pages/AIGenerateTasksPage";
import ShareLearningPlan from './pages/ShareLearningPlan';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        <Route path="/learning-progress" element={<LearningProgressPage />} />
        <Route path="/my-course/:courseId" element={<MyCourseDetail />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />


        <Route path="/learningplan" element={<LearningPlanPage />} />
          <Route path="/learningplan/view/:planId" element={<LearningPlanDetailPage />} />
          <Route path="/aigenerate-tasks" element={<AIGenerateTasksPage />} />
          <Route path="/learningplan/share/:planId" element={<ShareLearningPlan />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    </>
  );
}
