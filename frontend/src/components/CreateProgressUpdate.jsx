import React, { useState } from "react";
import axios from "axios";
import "../css/CreateProgressUpdate.css";
import { useNavigate } from "react-router-dom";

const CreateProgressUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    issuingOrganization: "",
    issueDateMonth: "",
    issueDateYear: "",
    expireDateMonth: "",
    expireDateYear: "",
    credentialId: "",
    credentialUrl: "",
    mediaUrl: "",
    skills: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const userId = "680a0de045c925018e55f1f3";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    // Simulating upload URL
    const fakeUrl = URL.createObjectURL(e.target.files[0]);
    setFormData((prev) => ({
      ...prev,
      mediaUrl: fakeUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      name: formData.name,
      issuingOrganization: formData.issuingOrganization,
      issueDate: {
        month: parseInt(formData.issueDateMonth),
        year: parseInt(formData.issueDateYear),
      },
      expireDate: {
        month: parseInt(formData.expireDateMonth),
        year: parseInt(formData.expireDateYear),
      },
      credentialId: formData.credentialId,
      credentialUrl: formData.credentialUrl,
      mediaUrl: formData.mediaUrl,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      await axios.post(
        `http://localhost:8081/api/v1/progress-updates/add/${userId}`,
        dto
      );
      alert("Progress update created successfully!");
      navigate("/profileProgress");
    } catch (err) {
      console.error("Error creating progress update:", err);
      alert("Failed to create progress update.");
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="create-progress-form-container">
      <h2>Create Progress Update</h2>
      <form onSubmit={handleSubmit} className="create-progress-form">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="issuingOrganization"
          placeholder="Issuing Organization"
          onChange={handleChange}
          required
        />

        <div className="date-group">
          <label>Issue Month</label>
          <select name="issueDateMonth" onChange={handleChange} required>
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            name="issueDateYear"
            placeholder="Issue Year"
            onChange={handleChange}
            required
          />
        </div>

        <div className="date-group">
          <label>Expire Month</label>
          <select name="expireDateMonth" onChange={handleChange}>
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            name="expireDateYear"
            placeholder="Expire Year"
            onChange={handleChange}
          />
        </div>

        <input
          name="credentialId"
          placeholder="Credential ID"
          onChange={handleChange}
        />
        <input
          name="credentialUrl"
          placeholder="Credential URL"
          onChange={handleChange}
        />

        <label>Upload Certificate</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateProgressUpdate;
