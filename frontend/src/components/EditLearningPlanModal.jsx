import React, { useState } from 'react';
import { updateLearningPlan } from '../services/learningPlanService';

const EditLearningPlanModal = ({ plan, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...plan });
  const [newSkill, setNewSkill] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTask, setNewTask] = useState({ taskName: '', taskDescription: '' });

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() !== '') {
      setForm(prev => ({ ...prev, topics: [...prev.topics, newTopic.trim()] }));
      setNewTopic('');
    }
  };

  const handleAddTask = () => {
    if (newTask.taskName.trim() !== '') {
      setForm(prev => ({ ...prev, tasks: [...prev.tasks, { ...newTask, completed: false }] }));
      setNewTask({ taskName: '', taskDescription: '' });
    }
  };

  const handleUpdateTask = (index, field, value) => {
    const updatedTasks = [...form.tasks];
    updatedTasks[index][field] = value;
    setForm(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = form.tasks.filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const handleSubmit = async () => {
    await updateLearningPlan(form.id, form);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center overflow-auto">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Update Learning Plan</h2>

        {/* Title, Background, Scope */}
        <input
          className="border w-full p-2 mb-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border w-full p-2 mb-2 rounded"
          placeholder="Background"
          value={form.background}
          onChange={(e) => setForm({ ...form, background: e.target.value })}
        />
        <input
          className="border w-full p-2 mb-4 rounded"
          placeholder="Scope"
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
        />

        {/* Skills */}
        <h3 className="font-semibold">Skills</h3>
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Add Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddSkill}>
            +
          </button>
        </div>
        <ul className="mb-4">
          {form.skills.map((skill, idx) => (
            <li key={idx} className="text-sm">{skill}</li>
          ))}
        </ul>

        {/* Topics */}
        <h3 className="font-semibold">Topics</h3>
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Add Topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddTopic}>
            +
          </button>
        </div>
        <ul className="mb-4">
          {form.topics.map((topic, idx) => (
            <li key={idx} className="text-sm">{topic}</li>
          ))}
        </ul>

        {/* Tasks */}
        <h3 className="font-semibold mb-2">Tasks</h3>
        {form.tasks.map((task, idx) => (
          <div key={idx} className="flex flex-col border p-2 mb-2 rounded">
            <input
              className="border mb-1 p-1 rounded"
              value={task.taskName}
              onChange={(e) => handleUpdateTask(idx, 'taskName', e.target.value)}
              placeholder="Task Name"
            />
            <input
              className="border mb-1 p-1 rounded"
              value={task.taskDescription}
              onChange={(e) => handleUpdateTask(idx, 'taskDescription', e.target.value)}
              placeholder="Task Description"
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded w-fit self-end text-sm"
              onClick={() => handleDeleteTask(idx)}
            >
              Delete
            </button>
          </div>
        ))}

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="New Task Name"
            value={newTask.taskName}
            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="New Task Description"
            value={newTask.taskDescription}
            onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddTask}>
            Add
          </button>
        </div>

        {/* Dates */}
        <h3 className="font-semibold mb-2">Timeline</h3>
        <input
          className="border w-full p-2 mb-2 rounded"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          className="border w-full p-2 mb-4 rounded"
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Update Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLearningPlanModal;
