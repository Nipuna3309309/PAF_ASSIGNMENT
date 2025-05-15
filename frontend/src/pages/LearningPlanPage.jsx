import React, { useEffect, useState } from 'react';
import { getMyLearningPlans, deleteLearningPlan } from '../services/learningPlanService';
import { getAllCourses } from '../services/dsrcourseService';
import CreateLearningPlanModal from '../components/CreateLearningPlanModal';
import EditLearningPlanModal from '../components/EditLearningPlanModal';
import { useNavigate } from 'react-router-dom';

const LearningPlanPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const [learningPlans, setLearningPlans] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    if (!userId) return;
    const plans = await getMyLearningPlans(userId);
    setLearningPlans(plans);

    const courses = await getAllCourses();
    setAllCourses(courses);

    const enrolledIds = plans.flatMap(plan => plan.relatedCourseIds || []);
    const uniqueEnrolledIds = [...new Set(enrolledIds)];

    const enrolledCourseDetails = courses.filter(course => uniqueEnrolledIds.includes(course.id));
    setEnrolledCourses(enrolledCourseDetails);
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      await deleteLearningPlan(id);
      fetchLearningPlans();
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Learning Plans</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Plan
        </button>
      </div>

      {/* Display User's Learning Plans */}
      {learningPlans.length === 0 ? (
        <p className="text-gray-600">No learning plans yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {learningPlans.map((plan) => (
            <div key={plan.id} className="border p-4 rounded shadow hover:shadow-lg bg-white">
              <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{plan.background}</p>
              <p className="text-sm mb-4">{plan.duration} hours</p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/learningplan/view/${plan.id}`)}
                  className="text-blue-600 underline text-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-green-600 underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 underline text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    const sharedPlans = JSON.parse(localStorage.getItem('sharedPlans')) || [];
                    localStorage.setItem('sharedPlans', JSON.stringify(sharedPlans));
                    navigate(`/learningplan/share/${plan.id}`);
                  }}
                  className="text-purple-600 underline text-sm"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display Currently Learning Courses Section */}
      {enrolledCourses.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Currently Learning Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <div key={course.id} className="border p-4 rounded shadow bg-white">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-700 text-sm">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateLearningPlanModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchLearningPlans}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPlan && (
        <EditLearningPlanModal
          plan={selectedPlan}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchLearningPlans}
        />
      )}
    </div>
  );
};

export default LearningPlanPage;
