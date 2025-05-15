import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Bell, Search, Edit, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import axios from 'axios';
import CourseProgress from '../components/CourseProgress';
import PostListPage from './PostListPage'; // Import the PostListPage component

const HomePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [coursesResponse, skillsResponse] = await Promise.all([
                    axios.get('http://localhost:8070/api/dsrcourses'),
                    axios.get(`http://localhost:8070/api/skills/${user.id}`)
                ]);
                setTrendingCourses(coursesResponse.data.slice(0, 5)); // Get top 5 courses
                setSkills(skillsResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">LearningHub</h1>
                    <div className="flex items-center space-x-4">
                        <Search className="text-gray-500" />
                        <Bell className="text-gray-500" />
                        <img src={user?.imageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 flex">
                <div className="w-1/4 pr-8">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <img src={user?.imageUrl} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-center">{user?.name}</h2>
                        <p className="text-gray-500 text-center">{user?.email}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Your Skills</h3>
                        <ul>
                            {skills.map((skill, index) => (
                                <li key={index} className="mb-1">{skill.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-1/2 px-4">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <img src={user?.imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
                            <input
                                type="text"
                                placeholder="Share your learning experience..."
                                className="flex-grow p-2 rounded-full bg-gray-100"
                                onClick={() => navigate('/post/create')}
                            />
                        </div>
                    </div>

                    {/* Include the PostListPage component here */}
                    <PostListPage />
                </div>

                <div className="w-1/4 pl-8">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <h3 className="font-semibold mb-2">Trending Courses</h3>
                        <ul>
                            {trendingCourses.map((course, index) => (
                                <li key={index} className="mb-2">
                                    <a href="#" className="text-blue-600 hover:underline">{course.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Quick Actions</h3>
                        <button onClick={() => navigate('/learning-progress')} className="w-full text-left mb-2 text-blue-600 hover:underline">View Learning Progress</button>
                        <button onClick={() => navigate('/post/myposts')} className="w-full text-left mb-2 text-blue-600 hover:underline">My Posts</button>
                        <button onClick={() => navigate('/learningplan')} className="w-full text-left mb-2 text-blue-600 hover:underline">Learning Plans</button>
                        <button onClick={() => navigate('/post/viewall')} className="w-full text-left text-blue-600 hover:underline">All Posts</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;