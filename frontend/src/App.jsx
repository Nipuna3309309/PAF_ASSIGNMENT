import "./App.css";
import CreateProgressUpdate from "./components/CreateProgressUpdate";
import CreateSkills from "./components/CreateSkills";
import ListProgressUpdate from "./components/ListProgressUpdate";
import ListUserProgressUpdates from "./components/ListUserProgressUpdates";
import UserProfileProgressPage from "./components/UserProfileProgressPage";

import UserSkills from "./components/UserSkills";
import HelloWorld from "./HelloWorld";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* //http://localhost:3000 */}
          <Route path="/" element={<ListProgressUpdate />}></Route>
          <Route
            path="/createProgressUpdate"
            element={<CreateProgressUpdate />}
          ></Route>
          <Route
            path="/getUserProgress"
            element={<ListUserProgressUpdates />}
          />
          <Route path="/getUserSkill" element={<UserSkills />} />

          <Route
            path="/profileProgress"
            element={<UserProfileProgressPage />}
          />

          <Route path="/createSkills" element={<CreateSkills />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
