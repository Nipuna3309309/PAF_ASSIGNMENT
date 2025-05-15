import React, { useState, useEffect } from 'react';
import AddManualTaskModal from './AddManualTaskModal';
import { createLearningPlan } from '../services/learningPlanService';
import { getAllCourses } from '../services/dsrcourseService';

const CreateLearningPlanModal = ({ onClose, onCreated }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    background: '',
    scope: '',
    skills: [],
    relatedCourseIds: [],
    topics: [],
    tasks: [],
    startDate: '',
    endDate: '',
  });

  const [allCourses, setAllCourses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getAllCourses();
      setAllCourses(courses);
    };
    fetchCourses();
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() === '') return;
    const updatedSkills = [...form.skills, skillInput.trim()];
    setForm(prev => ({ ...prev, skills: updatedSkills }));

    const matches = allCourses.filter(c =>
      c.category?.toLowerCase() === skillInput.trim().toLowerCase()
    );

    // ❌ DO NOT add to relatedCourseIds here
    setRelatedCourses(prev => [...prev, ...matches]);

    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = form.skills.filter(skill => skill !== skillToRemove);
    setForm(prev => ({ ...prev, skills: updatedSkills }));

    const updatedCourses = relatedCourses.filter(c =>
      c.category?.toLowerCase() !== skillToRemove.toLowerCase()
    );
    setRelatedCourses(updatedCourses);
    // No need to remove from relatedCourseIds here (user enrolled manually)
  };

  const handleEnrollCourse = (courseId) => {
    if (form.relatedCourseIds.includes(courseId)) {
      alert('Already Enrolled in this course.');
      return;
    }
    if (window.confirm('Do you want to enroll in this course?')) {
      setForm(prev => ({
        ...prev,
        relatedCourseIds: [...prev.relatedCourseIds, courseId],
      }));
      alert('Enrolled Successfully!');
    }
  };

  const handleAddTopic = () => {
    if (topicInput.trim() === '') return;
    setForm(prev => ({ ...prev, topics: [...prev.topics, topicInput.trim()] }));
    setTopicInput('');
  };

  const handleAddTask = (task) => {
    setForm(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    setShowAddTaskModal(false);
  };

  const handleCreatePlan = async () => {
    const finalPlan = { ...form, userId: user.id };
    await createLearningPlan(finalPlan);
    onCreated();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center overflow-auto">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Create Learning Plan (Step {step}/5)</h2>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <input className="border w-full p-2 mb-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="border w-full p-2 mb-2 rounded" placeholder="Background" value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} />
              <input className="border w-full p-2 mb-2 rounded" placeholder="Scope" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="flex gap-2 mb-2">
                <input className="border p-2 w-full rounded" placeholder="Add Skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleAddSkill}>+</button>
              </div>

              <ul className="mb-4">
                {form.skills.map((skill, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-center justify-between mb-1">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-600 ml-2 text-xs"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              {/* Related Courses */}
              {relatedCourses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Related Courses</h3>
                  <ul>
                    {relatedCourses.map((course) => (
                      <li
                        key={course.id}
                        className="text-sm text-blue-700 cursor-pointer underline mb-1"
                        onClick={() => handleEnrollCourse(course.id)}
                      >
                        {course.title} ({course.category})
                        {form.relatedCourseIds.includes(course.id) && (
                          <span className="ml-2 text-green-600 font-semibold">(Enrolled)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="flex gap-2 mb-2">
                <input className="border p-2 w-full rounded" placeholder="Add Topic" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleAddTopic}>+</button>
              </div>
              <ul>
                {form.topics.map((topic, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{topic}</li>
                ))}
              </ul>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <div>
                <button className="bg-green-600 text-white px-4 py-2 rounded mb-2" onClick={() => setShowAddTaskModal(true)}>
                  + Add Manual Task
                </button>
                <button
                  onClick={() => window.location.href = "/aigenerate-tasks"}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  + Create AI Based Tasks
                </button>
              </div>
              <ul>
                {form.tasks.map((task, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{task.taskName}</li>
                ))}
              </ul>
            </>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <>
              <input className="border w-full p-2 mb-2 rounded" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <input className="border w-full p-2 mb-2 rounded" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </>
          )}

          {/* Step Navigation */}
          <div className="flex justify-between mt-4">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="bg-gray-400 text-white px-4 py-1 rounded">Back</button>}
            {step < 5 && <button onClick={() => setStep(step + 1)} className="bg-blue-600 text-white px-4 py-1 rounded">Next</button>}
            {step === 5 && <button onClick={handleCreatePlan} className="bg-green-600 text-white px-4 py-1 rounded">Create Plan</button>}
          </div>
        </div>
      </div>

      {showAddTaskModal && <AddManualTaskModal onSave={handleAddTask} onCancel={() => setShowAddTaskModal(false)} />}
    </>
  );
};

export default CreateLearningPlanModal;
