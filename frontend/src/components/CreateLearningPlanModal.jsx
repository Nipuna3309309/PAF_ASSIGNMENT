import React, { useState, useEffect } from 'react';
import { createLearningPlan } from '../services/learningPlanService';
import { getAllCourses } from '../services/dsrcourseService';
import { X, Plus, ArrowRight, ArrowLeft, CheckCircle, BookOpen, Clock, Calendar, Trash2 } from 'lucide-react';

// Enhanced modal for adding tasks
const AddManualTaskModal = ({ onSave, onCancel }) => {
  const [task, setTask] = useState({
    taskName: '',
    description: '',
    dueDate: '',
    completed: false,
    priority: 'medium',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add New Task</h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task name"
              value={task.taskName}
              onChange={(e) => setTask({ ...task, taskName: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Task description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(task)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={!task.taskName}
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

// Tag component for skills and topics
const Tag = ({ text, onRemove }) => (
  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 group">
    {text}
    {onRemove && (
      <button
        onClick={() => onRemove(text)}
        className="text-blue-500 hover:text-blue-700 opacity-70 group-hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

// Course card component
const CourseCard = ({ course, isEnrolled, onEnroll }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-lg font-medium text-gray-800">{course.title}</h4>
        <p className="text-sm text-gray-500">{course.category}</p>
      </div>
      <button
        onClick={() => onEnroll(course.id)}
        className={`px-3 py-1 rounded-md text-sm ${
          isEnrolled 
            ? "bg-green-100 text-green-700 cursor-default flex items-center gap-1" 
            : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        }`}
        disabled={isEnrolled}
      >
        {isEnrolled ? (
          <>
            <CheckCircle size={14} />
            <span>Enrolled</span>
          </>
        ) : "Enroll"}
      </button>
    </div>
  </div>
);

// Enhanced CreateLearningPlanModal
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
  };

  const handleEnrollCourse = (courseId) => {
    if (form.relatedCourseIds.includes(courseId)) {
      return;
    }
    setForm(prev => ({
      ...prev,
      relatedCourseIds: [...prev.relatedCourseIds, courseId],
    }));
  };

  const handleAddTopic = () => {
    if (topicInput.trim() === '') return;
    setForm(prev => ({ ...prev, topics: [...prev.topics, topicInput.trim()] }));
    setTopicInput('');
  };

  const handleRemoveTopic = (topicToRemove) => {
    const updatedTopics = form.topics.filter(topic => topic !== topicToRemove);
    setForm(prev => ({ ...prev, topics: updatedTopics }));
  };

  const handleAddTask = (task) => {
    setForm(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    setShowAddTaskModal(false);
  };

  const handleRemoveTask = (indexToRemove) => {
    const updatedTasks = form.tasks.filter((_, index) => index !== indexToRemove);
    setForm(prev => ({ ...prev, tasks: updatedTasks }));
  };

  const handleCreatePlan = async () => {
    const finalPlan = { ...form, userId: user.id };
    await createLearningPlan(finalPlan);
    onCreated();
    onClose();
  };

  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Skills' },
    { id: 3, name: 'Topics' },
    { id: 4, name: 'Tasks' },
    { id: 5, name: 'Schedule' },
  ];

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return form.title.trim() !== '' && form.background.trim() !== '' && form.scope.trim() !== '';
      case 2:
        return form.skills.length > 0;
      case 3:
        return form.topics.length > 0;
      case 4:
        return true; // Tasks are optional
      case 5:
        return form.startDate !== '' && form.endDate !== '';
      default:
        return false;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center overflow-auto z-40">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl m-4 animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Create Learning Plan</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Progress steps */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        ${step > s.id 
                          ? 'bg-blue-600 text-white' 
                          : step === s.id 
                            ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-600' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {step > s.id ? <CheckCircle size={16} /> : s.id}
                    </div>
                    
                    <span 
                      className={`hidden md:block ml-2 text-sm
                        ${step === s.id 
                          ? 'text-blue-800 font-medium' 
                          : step > s.id 
                            ? 'text-gray-700' 
                            : 'text-gray-500'
                        }`}
                    >
                      {s.name}
                    </span>
                    
                    {i < steps.length - 1 && (
                      <div className={`w-12 h-1 mx-2 ${step > s.id ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    placeholder="Give your learning plan a descriptive title" 
                    value={form.title} 
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    rows="4"
                    placeholder="Describe your current knowledge and experience level" 
                    value={form.background} 
                    onChange={(e) => setForm(prev => ({ ...prev, background: e.target.value }))} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Scope <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    rows="4"
                    placeholder="What do you want to achieve with this learning plan?" 
                    value={form.scope} 
                    onChange={(e) => setForm(prev => ({ ...prev, scope: e.target.value }))} 
                  />
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills to Acquire <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Add a skill" 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button 
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 flex items-center justify-center transition"
                      onClick={handleAddSkill}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  {form.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.skills.map((skill, idx) => (
                        <Tag key={idx} text={skill} onRemove={handleRemoveSkill} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No skills added yet. Add skills to get course recommendations.</p>
                  )}
                </div>
                
                {/* Related Courses */}
                {relatedCourses.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BookOpen size={18} />
                      Related Courses
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {relatedCourses.map((course) => (
                        <CourseCard 
                          key={course.id}
                          course={course}
                          isEnrolled={form.relatedCourseIds.includes(course.id)}
                          onEnroll={handleEnrollCourse}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Topics */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topics to Cover <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Add a topic" 
                      value={topicInput} 
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    />
                    <button 
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 flex items-center justify-center transition"
                      onClick={handleAddTopic}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  {form.topics.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.topics.map((topic, idx) => (
                        <Tag key={idx} text={topic} onRemove={handleRemoveTopic} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">Add specific topics you want to learn about.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Tasks */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    <Plus size={18} />
                    Add Manual Task
                  </button>
                  <button
                    onClick={() => window.location.href = "/aigenerate-tasks"}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                      <circle cx="7.5" cy="11.5" r="1.5" />
                      <circle cx="12" cy="8" r="1.5" />
                      <circle cx="16.5" cy="11.5" r="1.5" />
                    </svg>
                    Generate AI Tasks
                  </button>
                </div>
                
                {form.tasks.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    {form.tasks.map((task, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{task.taskName}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            {task.dueDate && (
                              <div className="flex items-center text-sm text-gray-500 mt-2">
                                <Clock size={14} className="mr-1" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                            {task.priority && (
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full capitalize
                                ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'}`}
                              >
                                {task.priority} priority
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveTask(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500">No tasks added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add manual tasks or generate AI-based tasks</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Schedule */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={form.startDate} 
                      onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={form.endDate} 
                      min={form.startDate} 
                      onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))} 
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                  <h4 className="font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Learning Plan Summary
                  </h4>
                  <ul className="mt-2 text-sm space-y-1">
                    <li><span className="font-medium">Title:</span> {form.title || '(Not set)'}</li>
                    <li><span className="font-medium">Skills:</span> {form.skills.length > 0 ? form.skills.join(', ') : '(None added)'}</li>
                    <li><span className="font-medium">Topics:</span> {form.topics.length > 0 ? form.topics.join(', ') : '(None added)'}</li>
                    <li><span className="font-medium">Tasks:</span> {form.tasks.length} task(s) added</li>
                    <li><span className="font-medium">Courses:</span> {form.relatedCourseIds.length} course(s) enrolled</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            
            {step < 5 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={!isStepComplete()}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleCreatePlan}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                disabled={!isStepComplete()}
              >
                Create Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {showAddTaskModal && <AddManualTaskModal onSave={handleAddTask} onCancel={() => setShowAddTaskModal(false)} />}
    </>
  );
};

export default CreateLearningPlanModal;