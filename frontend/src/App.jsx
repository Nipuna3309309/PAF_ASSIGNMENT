import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MyCourseDetail from "./pages/MyCourseDetail";
import LearningProgressPage from "./pages/LearningProgressPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CertificatePage from "./pages/CertificatePage";

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
      </Routes>
    </>
  );
}

export default App;
