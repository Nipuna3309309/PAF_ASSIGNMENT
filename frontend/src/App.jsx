import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/certificate/:courseId" element={<CertificatePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
