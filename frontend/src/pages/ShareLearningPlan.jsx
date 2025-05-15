import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyLearningPlans } from '../services/learningPlanService';
import { Calendar, Clock, BookOpen, CheckSquare, ChevronLeft, Trash2, Award } from 'lucide-react';

const ShareLearningPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sharedPlans, setSharedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSaveSharedPlan = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const plans = await getMyLearningPlans(user.id);
        const selectedPlan = plans.find((p) => p.id === planId);

        if (selectedPlan) {
          const existingShared = JSON.parse(localStorage.getItem('sharedPlans')) || [];

          // Check if already shared to avoid duplicates
          const alreadyShared = existingShared.find(p => p.id === selectedPlan.id);
          if (!alreadyShared) {
            const updatedShared = [selectedPlan, ...existingShared];
            localStorage.setItem('sharedPlans', JSON.stringify(updatedShared));
            setSharedPlans(updatedShared);
          } else {
            setSharedPlans(existingShared);
          }
        }
      } catch (error) {
        console.error("Error fetching learning plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSaveSharedPlan();
  }, [planId, user?.id]);

  useEffect(() => {
    const existingShared = JSON.parse(localStorage.getItem('sharedPlans')) || [];
    setSharedPlans(existingShared);
    setIsLoading(false);
  }, []);

  const handleDeleteSharedPlan = (planIdToDelete) => {
    const updatedSharedPlans = sharedPlans.filter(plan => plan.id !== planIdToDelete);
    localStorage.setItem('sharedPlans', JSON.stringify(updatedSharedPlans));
    setSharedPlans(updatedSharedPlans);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8 font-medium"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shared Learning Plans</h1>
          <p className="text-gray-600 max-w-2xl">
            View and manage your shared learning plans. These plans are available for reference and collaboration.
          </p>
        </div>

        {sharedPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-700 mb-2">No shared learning plans yet</h2>
            <p className="text-gray-500 mb-6">When you share a learning plan, it will appear here for easy access.</p>
            <button 
              onClick={() => navigate('/learning-plans')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Browse Your Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {sharedPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100"
              >
                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.title}</h2>
                  <button
                    onClick={() => handleDeleteSharedPlan(plan.id)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Delete plan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-gray-800 mb-3 font-medium">{plan.background}</p>
                    <p className="text-gray-600">{plan.scope}</p>
                  </div>
                  
                  <div className="mb-6 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      <span>
                        {plan.startDate} to {plan.endDate}
                      </span>
                    </div>
                    {plan.tasks && (
                      <div className="flex items-center text-gray-700">
                        <CheckSquare size={16} className="mr-2 text-green-600" />
                        <span>
                          {plan.tasks.filter(t => t.completed).length}/{plan.tasks.length} tasks completed
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plan.skills && plan.skills.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Award size={18} className="text-blue-700 mr-2" />
                          <h3 className="font-semibold text-blue-900">Skills</h3>
                        </div>
                        <ul className="space-y-2">
                          {plan.skills.map((skill, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                              <span className="text-gray-800">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {plan.topics && plan.topics.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <BookOpen size={18} className="text-green-700 mr-2" />
                          <h3 className="font-semibold text-green-900">Topics</h3>
                        </div>
                        <ul className="space-y-2">
                          {plan.topics.map((topic, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-600 mt-2 mr-2"></span>
                              <span className="text-gray-800">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {plan.tasks && plan.tasks.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <CheckSquare size={18} className="text-purple-700 mr-2" />
                          <h3 className="font-semibold text-purple-900">Tasks</h3>
                        </div>
                        <ul className="space-y-2">
                          {plan.tasks.map((task, i) => (
                            <li key={i} className="flex items-start">
                              <span className={`inline-block w-4 h-4 rounded-sm border ${task.completed ? 'bg-purple-600 border-purple-600' : 'border-gray-400'} mt-1 mr-2`}>
                                {task.completed && (
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </span>
                              <span className={`text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.taskName}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareLearningPlan;