import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/UserProfilePage.css";
import { Pencil, Trash2 } from "lucide-react";

const UserProfilePage = () => {
  const userId = "680a0de045c925018e55f1f3";
  const [skills, setSkills] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/skills/${userId}`
      );
      setSkills(response.data || []);
    } catch (err) {
      console.error("Error fetching user skills:", err);
      setError("Failed to load user skills.");
    }
  };

  const fetchProgressUpdates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/progress-updates/user/${userId}`
      );
      const data = response.data;
      const validData = data?.filter((item) => item && item.id);
      setProgressUpdates(validData || []);
    } catch (err) {
      console.error("Error fetching progress updates:", err);
      setError("Failed to load progress updates.");
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchProgressUpdates();
  }, []);

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/v1/skills/${userId}/${skillId}`
      );
      fetchSkills(); // refresh list after removal
    } catch (err) {
      console.error("Failed to remove skill from user:", err);
      setError("Failed to remove skill from user.");
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleEdit = (progressId) => {
    navigate(`/editProgressUpdate/${progressId}`);
  };

  const handleDelete = async (progressId) => {
    // add confirmation + axios delete call
  };

  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>

      {/* Skills Section */}
      <div className="skills-section">
        <h2>User Skills</h2>
        <button onClick={() => navigate("/createSkills")}>Add Skill</button>
        {skills.length === 0 ? (
          <p className="empty-msg">No skills found for this user.</p>
        ) : (
          <ul className="skills-list">
            {skills.map((skill, index) => (
              <li key={skill?.id || index}>
                {skill?.name || "Unnamed Skill"}
                <button onClick={() => handleDeleteSkill(skill.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Progress Updates Section */}
      <div className="progress-section">
        <h2>Progress Updates</h2>
        <button onClick={() => navigate("/createProgressUpdate")}>
          Add Progress Update
        </button>
        {progressUpdates.length === 0 ? (
          <p className="empty-msg">No progress updates available.</p>
        ) : (
          <div className="progress-list">
            {progressUpdates.map((item) => (
              <div key={item.id} className="progress-card">
                <div className="progress-header">
                  <h3>{item?.name || "No Name Provided"}</h3>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p>
                  <strong>Issued By:</strong>{" "}
                  {item?.issuingOrganization || "N/A"}
                </p>
                <p>
                  <strong>Issue Date:</strong> {item?.issueDate?.month}/
                  {item?.issueDate?.year}
                </p>
                {item?.expireDate?.year !== 0 && (
                  <p>
                    <strong>Expire Date:</strong> {item?.expireDate?.month}/
                    {item?.expireDate?.year}
                  </p>
                )}
                <p>
                  <strong>Credential ID:</strong> {item?.credentialId || "N/A"}
                </p>
                <a
                  href={item?.credentialUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate
                </a>
                <br />
                {item?.mediaUrl && (
                  <img
                    src={item?.mediaUrl}
                    alt={`${item?.name} Certificate`}
                    className="certificate-img"
                  />
                )}
                {Array.isArray(item.skills) && item.skills.length > 0 && (
                  <div className="inner-skills">
                    <strong>Skills:</strong>
                    <ul>
                      {item.skills.map((skill, index) => (
                        <li key={skill?.id || index}>
                          {skill?.name || "Unnamed Skill"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../css/UserProfilePage.css";

// const UserProfilePage = () => {
//   const userId = "680a0de045c925018e55f1f3";
//   const [skills, setSkills] = useState([]);
//   const [progressUpdates, setProgressUpdates] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/v1/skills/${userId}`
//         );
//         setSkills(response.data || []);
//       } catch (err) {
//         console.error("Error fetching user skills:", err);
//         setError("Failed to load user skills.");
//       }
//     };

//     const fetchProgressUpdates = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8081/api/v1/progress-updates/user/${userId}`
//         );
//         const data = response.data;
//         const validData = data?.filter((item) => item && item.id);
//         setProgressUpdates(validData || []);
//       } catch (err) {
//         console.error("Error fetching progress updates:", err);
//         setError("Failed to load progress updates.");
//       }
//     };

//     fetchSkills();
//     fetchProgressUpdates();
//   }, [userId]);

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="user-profile-container">
//       <h1>User Profile</h1>

//       {/* Skills Section */}
//       <div className="skills-section">
//         <h2>User Skills</h2>
//         {skills.length === 0 ? (
//           <p className="empty-msg">No skills found for this user.</p>
//         ) : (
//           <ul className="skills-list">
//             {skills.map((skill, index) => (
//               <li key={skill?.id || index}>{skill?.name || "Unnamed Skill"}</li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Progress Updates Section */}
//       <div className="progress-section">
//         <h2>Progress Updates</h2>
//         {progressUpdates.length === 0 ? (
//           <p className="empty-msg">No progress updates available.</p>
//         ) : (
//           <div className="progress-list">
//             {progressUpdates.map((item) => (
//               <div key={item.id} className="progress-card">
//                 <h3>{item?.name || "No Name Provided"}</h3>
//                 <p>
//                   <strong>Issued By:</strong>{" "}
//                   {item?.issuingOrganization || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Issue Date:</strong> {item?.issueDate?.month}/
//                   {item?.issueDate?.year}
//                 </p>
//                 {item?.expireDate?.year !== 0 && (
//                   <p>
//                     <strong>Expire Date:</strong> {item?.expireDate?.month}/
//                     {item?.expireDate?.year}
//                   </p>
//                 )}
//                 <p>
//                   <strong>Credential ID:</strong> {item?.credentialId || "N/A"}
//                 </p>
//                 <a
//                   href={item?.credentialUrl || "#"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   View Certificate
//                 </a>
//                 <br />
//                 {item?.mediaUrl && (
//                   <img
//                     src={item?.mediaUrl}
//                     alt={`${item?.name} Certificate`}
//                     className="certificate-img"
//                   />
//                 )}
//                 {Array.isArray(item.skills) && item.skills.length > 0 && (
//                   <div className="inner-skills">
//                     <strong>Skills:</strong>
//                     <ul>
//                       {item.skills.map((skill, index) => (
//                         <li key={skill?.id || index}>
//                           {skill?.name || "Unnamed Skill"}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
