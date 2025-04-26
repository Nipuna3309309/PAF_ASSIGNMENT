import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaEdit, FaTrash, FaShare, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyPosts = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/posts/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setMyPosts(data);
        } catch (err) {
            console.error('Error loading personal posts:', err);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setMyPosts(myPosts.filter(post => post.id !== id));
            } else {
                alert("Failed to delete post.");
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const handleEdit = (id, currentDesc) => {
        setEditingPostId(id);
        setEditedDescription(currentDesc);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedDescription),
            });

            if (res.ok) {
                const updatedPost = await res.json();
                setMyPosts(myPosts.map(p => (p.id === id ? updatedPost : p)));
                setEditingPostId(null);
                setEditedDescription('');
            } else {
                alert("Update failed.");
            }
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleBack = () => {
        navigate('/post');  // Navigate to the main Post component
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('http://localhost:8080/auth/signout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Error signing out on server:', err);
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        className="mr-4 text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={handleBack}
                    >
                        <FaArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
                </div>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {myPosts.length === 0 ? (
                <p className="text-gray-600 text-center">You haven't posted anything yet.</p>
            ) : (
                myPosts.map((post) => (
                    <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                    <span className="text-xl font-semibold text-white">U</span>
                                </div>
                                <span className="font-medium text-gray-700">You</span>
                                <span className="text-gray-500 text-sm ml-auto">
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>

                            {editingPostId === post.id ? (
                                <div className="mt-2">
                                    <textarea
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                            onClick={() => handleEditSubmit(post.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                            onClick={() => setEditingPostId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-800 whitespace-pre-wrap">{post.description}</p>
                            )}
                        </div>

                        {post.mediaType === 'IMAGE' && post.imageUrls?.length > 0 && (
                            <div className="flex flex-col gap-2 p-2">
                                {post.imageUrls.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Post ${idx}`}
                                        className="w-full rounded cursor-pointer"
                                        style={{
                                            maxHeight: '600px',
                                            objectFit: 'contain'
                                        }}
                                        onClick={() => {
                                            setModalImages(post.imageUrls);
                                            setCurrentImageIndex(idx);
                                            setOpenModal(true);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {post.mediaType === 'VIDEO' && post.videoUrl && (
                            <div className="p-4">
                                <video
                                    controls
                                    className="w-full rounded-md"
                                >
                                    <source src={post.videoUrl} type="video/mp4" />
                                </video>
                            </div>
                        )}

                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                            <div className="flex space-x-4">
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                                    <FaHeart className="mr-1" /> Like
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                                    <FaComment className="mr-1" /> Comment
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                                    <FaShare className="mr-1" /> Share
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                    onClick={() => handleEdit(post.id, post.description)}
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                                <button
                                    className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    <FaTrash className="mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Modal for full image view */}
            {openModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
                    <div className="max-w-4xl max-h-[90vh] relative">
                        <button
                            className="absolute top-0 right-0 m-4 text-white text-2xl"
                            onClick={() => setOpenModal(false)}
                        >
                            &times;
                        </button>
                        <img
                            src={modalImages[currentImageIndex]}
                            alt={`Full Preview`}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        {modalImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
                                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length)}
                                >
                                    &lt;
                                </button>
                                <button
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
                                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % modalImages.length)}
                                >
                                    &gt;
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPosts;