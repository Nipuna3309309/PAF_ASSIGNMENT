import React, { useEffect, useState } from 'react';
import { getMyLearningPlans, deleteLearningPlan } from '../services/learningPlanService';
import { getAllCourses } from '../services/dsrcourseService';
import CreateLearningPlanModal from '../components/CreateLearningPlanModal';
import EditLearningPlanModal from '../components/EditLearningPlanModal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Trash2, Edit2, Share2, Eye, CheckCircle } from 'lucide-react';

const LearningPlanPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const [learningPlans, setLearningPlans] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [planProgress, setPlanProgress] = useState({});

  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const plans = await getMyLearningPlans(userId);
      
      // Get progress for each plan from localStorage
      const progressData = {};
      plans.forEach(plan => {
        const storedProgress = localStorage.getItem(`plan_${plan.id}_progress`);
        progressData[plan.id] = storedProgress ? parseInt(storedProgress) : 0;
      });
      setPlanProgress(progressData);
      
      setLearningPlans(plans);

      const courses = await getAllCourses();
      setAllCourses(courses);

      const enrolledIds = plans.flatMap(plan => plan.relatedCourseIds || []);
      const uniqueEnrolledIds = [...new Set(enrolledIds)];

      const enrolledCourseDetails = courses.filter(course => uniqueEnrolledIds.includes(course.id));
      setEnrolledCourses(enrolledCourseDetails);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPlans();
  }, [userId]);

  const handleDelete = async (id) => {
    setPlanToDelete(id);
    
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await deleteLearningPlan(id);
        // Allow animation to complete before refreshing the list
        setTimeout(() => {
          fetchLearningPlans();
          setPlanToDelete(null);
        }, 300);
      } catch (error) {
        console.error('Error deleting plan:', error);
        setPlanToDelete(null);
      }
    } else {
      setPlanToDelete(null);
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleShare = (plan) => {
    const sharedPlans = JSON.parse(localStorage.getItem('sharedPlans')) || [];
    localStorage.setItem('sharedPlans', JSON.stringify(sharedPlans));
    navigate(`/learningplan/share/${plan.id}`);
  };

  // Get completion status based on progress
  const getCompletionStatus = (planId) => {
    const progress = planProgress[planId] || 0;
    if (progress === 100) return 'Completed';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  };

  // Get status color based on completion status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-green-50';
      case 'In Progress':
        return 'bg-blue-500 text-blue-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated gradient */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-xl p-6 md:p-8 mb-8 shadow-lg"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Learning Journey</h1>
              <p className="text-blue-100 max-w-lg">Track your progress, manage your learning plans, and achieve your goals.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-5 py-3 rounded-lg shadow-md font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="text-lg">+</span>
              <span>Create New Plan</span>
            </motion.button>
          </div>
          
          {/* Animated decoration */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400 opacity-20 rounded-full"></div>
        </motion.div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-blue-200"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-600 border-t-transparent"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Learning Plans Section */}
            <section className="mb-12">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"
              >
                <BookOpen className="text-blue-600" size={24} />
                Your Learning Plans
              </motion.h2>

              {learningPlans.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
                >
                  <img
                    src="/api/placeholder/300/200"
                    alt="No plans found"
                    className="mx-auto mb-6 opacity-60"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">No Learning Plans Yet</h3>
                  <p className="text-gray-500 mb-6">Create your first learning plan to start organizing your educational journey.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Your First Plan
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {learningPlans.map((plan) => {
                      const progress = planProgress[plan.id] || 0;
                      const status = getCompletionStatus(plan.id);
                      return (
                        <motion.div
                          key={plan.id}
                          variants={itemVariants}
                          exit="exit"
                          layout
                          className={`group relative overflow-hidden rounded-xl bg-white border-l-4 border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 ${
                            planToDelete === plan.id ? 'animate-shake opacity-50' : ''
                          }`}
                        >
                          {/* Card decorative elements */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transform-opacity group-hover:opacity-100 opacity-0 transition-opacity"></div>
                          
                          <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                              {status === 'Completed' && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  <CheckCircle size={12} />
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plan.background}</p>
                            
                            <div className="flex items-center text-blue-600 mb-4">
                              <Clock size={16} className="mr-2" />
                              <span className="text-sm font-medium">{plan.duration} hours</span>
                            </div>
                            
                            {/* Progress bar with actual progress */}
                            <div className="mb-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className={`font-medium ${status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                                  {progress}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                              <div
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/learningplan/view/${plan.id}`)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(plan)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-sm hover:bg-green-100 transition-colors"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(plan.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleShare(plan)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-sm hover:bg-purple-100 transition-colors"
                              >
                                <Share2 size={14} />
                                <span>Share</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </section>

            {/* Currently Learning Section */}
            {enrolledCourses.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  Currently Learning
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {enrolledCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.1 } 
                        }}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {/* Course header with gradient */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>
                          <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <BookOpen className="text-blue-600" size={24} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                          <div className="bg-blue-50 text-blue-600 text-xs rounded-full px-3 py-1 inline-block mb-4">
                            {course.category}
                          </div>
                          
                          {/* Random progress bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="text-blue-600 font-medium">{Math.floor(Math.random() * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Continue Learning</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </>
        )}
      </div>

      {/* Create Modal with AnimatePresence */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-lg"
            >
              <CreateLearningPlanModal
                onClose={() => setShowCreateModal(false)}
                onCreated={fetchLearningPlans}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal with AnimatePresence */}
      <AnimatePresence>
        {showEditModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-lg"
            >
              <EditLearningPlanModal
                plan={selectedPlan}
                onClose={() => setShowEditModal(false)}
                onUpdated={fetchLearningPlans}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningPlanPage;