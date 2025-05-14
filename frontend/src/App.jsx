import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/certificate/:courseId" element={<CertificatePage />} />
          <Route path="/learning-progress" element={<LearningProgressPage />} />
          <Route path="/my-course/:courseId" element={<MyCourseDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
