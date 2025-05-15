import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningPlanById } from '../services/learningPlanService';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Award, Clock, CheckCircle, Circle, Bookmark, ChevronRight, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const LearningPlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const navigate = useNavigate();
  const [completionStatus, setCompletionStatus] = useState('Not Started');

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const data = await getLearningPlanById(planId);
        setPlan(data);

        // Initialize task status from localStorage or default to unchecked
        const savedStatus = localStorage.getItem(`plan_${planId}_status`);
        if (savedStatus) {
          setTaskStatus(JSON.parse(savedStatus));
        } else {
          const initialStatus = {};
          data.tasks.forEach((_, idx) => {
            initialStatus[idx] = false;
          });
          setTaskStatus(initialStatus);
        }
      } catch (error) {
        console.error('Error fetching learning plan details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  useEffect(() => {
    // Save task status to localStorage when it changes
    if (plan && Object.keys(taskStatus).length) {
      localStorage.setItem(`plan_${planId}_status`, JSON.stringify(taskStatus));
      
      // Calculate previous progress
      const totalTasks = plan.tasks.length;
      const completedTasks = Object.values(taskStatus).filter(Boolean).length;
      
      // Update completion status
      if (completedTasks === 0) {
        setCompletionStatus('Not Started');
      } else if (completedTasks === totalTasks) {
        setCompletionStatus('Completed');
        triggerConfetti();
      } else {
        setCompletionStatus('In Progress');
      }
      
      // Save progress to localStorage so it can be accessed from LearningPlanPage
      const progress = Math.floor((completedTasks / totalTasks) * 100);
      localStorage.setItem(`plan_${planId}_progress`, progress.toString());
    }
  }, [taskStatus, planId, plan]);

  const handleCheck = (idx) => {
    setTaskStatus(prev => {
      const newStatus = {
        ...prev,
        [idx]: !prev[idx]
      };
      
      // Check if this was the last task to complete
      if (plan) {
        const totalTasks = plan.tasks.length;
        const newCompletedCount = Object.values(newStatus).filter(Boolean).length;
        
        // Only trigger confetti when all tasks are completed
        if (newCompletedCount === totalTasks && newCompletedCount > Object.values(prev).filter(Boolean).length) {
          setTimeout(() => triggerConfetti(), 300);
        }
      }
      
      return newStatus;
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Calculate progress percentage
  const progress = plan?.tasks.length
    ? (Object.values(taskStatus).filter(Boolean).length / plan.tasks.length) * 100
    : 0;

  // Group tasks by category if available, otherwise use "Tasks" as default
  const getTasksByCategory = () => {
    if (!plan) return {};
    
    return plan.tasks.reduce((acc, task, idx) => {
      const category = task.category || 'Tasks';
      if (!acc[category]) acc[category] = [];
      acc[category].push({ ...task, idx });
      return acc;
    }, {});
  };

  const tasksByCategory = getTasksByCategory();
  const categories = plan ? Object.keys(tasksByCategory) : [];

  const getFilteredTasks = () => {
    if (activeCategoryTab === 'all') {
      return plan.tasks.map((task, idx) => ({ ...task, idx }));
    }
    return tasksByCategory[activeCategoryTab] || [];
  };

  // Get status color based on completion status
  const getStatusColor = () => {
    switch (completionStatus) {
      case 'Completed':
        return 'bg-green-500 text-green-50';
      case 'In Progress':
        return 'bg-blue-500 text-blue-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full absolute border-4 border-blue-200"></div>
          <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-6 max-w-5xl mx-auto my-10 bg-white rounded-xl shadow-md text-center">
        <p className="text-red-500 text-xl">Learning plan not found</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto gap-2"
        >
          <ArrowLeft size={18} />
          <span>Back to Learning Plans</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back to Learning Plans</span>
          </motion.button>
        </motion.div>

        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="relative">
            {/* Progress overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-10" style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}></div>
            
            {/* Header background */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3"></div>
            
            <div className="p-6 relative z-20">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{plan.title}</h1>
                  <p className="text-gray-600 mb-2">{plan.background}</p>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-blue-50 text-blue-700 rounded-lg p-4 flex flex-col items-center">
                    <BarChart2 size={24} className="mb-2" />
                    <p className="text-lg font-semibold">{Math.round(progress)}%</p>
                    <p className="text-sm">Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <Calendar className="text-blue-600 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-700">Timeline</h3>
                  <p className="text-gray-600 text-sm">{plan.startDate} to {plan.endDate}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Award className="text-blue-600 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-700">Skills</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plan.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Bookmark className="text-blue-600 mr-3 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-700">Topics</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plan.topics.map((topic, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md mb-8 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {completionStatus}
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                    {Object.values(taskStatus).filter(Boolean).length} of {plan.tasks.length} tasks
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="flex h-4 mb-4 overflow-hidden rounded-full bg-blue-100">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, type: "spring", stiffness: 50 }}
                  className="flex flex-col justify-center text-center text-white whitespace-nowrap bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out"
                />
              </div>
            </div>
            
            {completionStatus === 'Completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200"
              >
                <CheckCircle className="mx-auto mb-2" size={32} />
                <p className="font-semibold">Congratulations! You have completed this learning plan.</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tasks</h2>
            
            {/* Category tabs if we have multiple categories */}
            {categories.length > 1 && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveCategoryTab('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategoryTab === 'all'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    All Tasks
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategoryTab(category)}
                      className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeCategoryTab === category
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {getFilteredTasks().map((task) => (
                <motion.div
                  key={task.idx}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    show: { y: 0, opacity: 1 }
                  }}
                  className={`border rounded-xl p-4 transition-all duration-200 ${
                    taskStatus[task.idx] 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:shadow-md border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleCheck(task.idx)}
                        className="focus:outline-none"
                      >
                        {taskStatus[task.idx] ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <Circle className="text-gray-400" size={24} />
                        )}
                      </motion.button>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg ${taskStatus[task.idx] ? 'text-green-700 line-through opacity-75' : 'text-gray-800'}`}>
                        {task.taskName}
                      </h4>
                      <p className={`${taskStatus[task.idx] ? 'text-green-600 opacity-75' : 'text-gray-600'}`}>
                        {task.taskDescription}
                      </p>
                      
                      {task.resourceUrl && (
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          href={task.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <span>View Resource</span>
                          <ChevronRight size={16} />
                        </motion.a>
                      )}
                      
                      {task.estimatedTime && (
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                          <Clock size={14} />
                          <span>{task.estimatedTime} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPlanDetailPage;