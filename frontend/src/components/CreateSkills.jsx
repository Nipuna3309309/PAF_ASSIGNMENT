import React, { useState } from "react";
import axios from "axios";
import "../css/CreateSkills.css"; // Optional if you're styling it
import { useNavigate } from "react-router-dom";

const CreateSkills = () => {
  const [skillName, setSkillName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userId = "680a0de045c925018e55f1f3"; // Replace with actual user ID if dynamic

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skill = {
      skillName: skillName,
    };

    try {
      await axios.post(`http://localhost:8081/api/v1/skills/${userId}`, skill);
      setMessage("Skill added successfully!");
      alert("Progress update created successfully!");
      setSkillName("");

      setTimeout(() => {
        navigate("/profileProgress");
      }, 1500);
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Failed to add skill.");
    }
  };

  return (
    <div className="create-skill-form-container">
      <h2>Add Skill</h2>
      <form onSubmit={handleSubmit} className="create-skill-form">
        <input
          type="text"
          name="skillName"
          placeholder="Enter Skill Name"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
        />
        <button type="submit">Add Skill</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateSkills;
