import React, { useState } from 'react';
import { updateLearningPlan } from '../services/learningPlanService';
import { PlusCircle, Trash2, X, Calendar, BookOpen, Target, Award, ListChecks } from 'lucide-react';

const EditLearningPlanModal = ({ plan, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...plan });
  const [newSkill, setNewSkill] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTask, setNewTask] = useState({ taskName: '', taskDescription: '' });
  const [activeTab, setActiveTab] = useState('details');

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

  const handleDeleteSkill = (index) => {
    const updatedSkills = form.skills.filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleDeleteTopic = (index) => {
    const updatedTopics = form.topics.filter((_, idx) => idx !== index);
    setForm(prev => ({ ...prev, topics: updatedTopics }));
  };

  const handleSubmit = async () => {
    await updateLearningPlan(form.id, form);
    onUpdated();
    onClose();
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-auto z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Update Learning Plan</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('details')}
          >
            <BookOpen size={18} /> Details
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('content')}
          >
            <Target size={18} /> Content
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center gap-2 ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListChecks size={18} /> Tasks
          </button>
        </div>
        
        {/* Content area */}
        <div className="overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Learning Plan Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                <textarea
                  className="border border-gray-300 w-full p-2 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Background information about this learning plan"
                  value={form.background}
                  onChange={(e) => setForm({ ...form, background: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Scope of this learning plan"
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Start Date
                  </label>
                  <input
                    className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> End Date
                  </label>
                  <input
                    className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Award size={18} /> Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Add new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                  />
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition flex items-center"
                    onClick={handleAddSkill}
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, idx) => (
                    <div key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                      {skill}
                      <button 
                        onClick={() => handleDeleteSkill(idx)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {form.skills.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No skills added yet</p>
                  )}
                </div>
              </div>
              
              {/* Topics */}
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <BookOpen size={18} /> Topics
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Add new topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddTopic)}
                  />
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition flex items-center"
                    onClick={handleAddTopic}
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.topics.map((topic, idx) => (
                    <div key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                      {topic}
                      <button 
                        onClick={() => handleDeleteTopic(idx)}
                        className="text-green-600 hover:text-green-800 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {form.topics.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No topics added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div>
              <div className="mb-4">
                <label className="block text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <ListChecks size={18} /> Tasks
                </label>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Task</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <input
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Task Name"
                      value={newTask.taskName}
                      onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                    />
                    <input
                      className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Task Description"
                      value={newTask.taskDescription}
                      onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
                    />
                  </div>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 text-sm"
                    onClick={handleAddTask}
                  >
                    <PlusCircle size={16} /> Add Task
                  </button>
                </div>
                
                <div className="space-y-3">
                  {form.tasks.map((task, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow transition">
                      <div className="flex justify-between">
                        <input
                          className="font-medium text-gray-800 bg-transparent border-none w-full focus:outline-none focus:ring-0"
                          value={task.taskName}
                          onChange={(e) => handleUpdateTask(idx, 'taskName', e.target.value)}
                          placeholder="Task Name"
                        />
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors ml-2"
                          onClick={() => handleDeleteTask(idx)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <input
                        className="text-gray-600 text-sm bg-transparent border-none w-full focus:outline-none focus:ring-0 mt-1"
                        value={task.taskDescription}
                        onChange={(e) => handleUpdateTask(idx, 'taskDescription', e.target.value)}
                        placeholder="Task Description"
                      />
                    </div>
                  ))}
                  {form.tasks.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No tasks added yet</p>
                      <p className="text-sm text-gray-400">Add tasks to track your learning progress</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Update Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLearningPlanModal;