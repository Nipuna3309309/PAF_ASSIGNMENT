import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadFile, VideoLibrary, Image, Close, Mood, Send } from '@mui/icons-material';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Clean up object URLs to avoid memory leaks
        return () => previews.forEach(URL.revokeObjectURL);
    }, [previews]);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (isVideo) {
            if (files.length > 1) return alert('Only 1 video allowed');
        } else {
            if (files.length > 3) return alert('Up to 3 images allowed');
        }
        setMediaFiles(files);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removeMedia = (index) => {
        const newMediaFiles = [...mediaFiles];
        newMediaFiles.splice(index, 1);
        setMediaFiles(newMediaFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mediaFiles.length === 0) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('description', description);
        formData.append('isVideo', isVideo);
        mediaFiles.forEach((file) => formData.append('mediaFiles', file));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                setDescription('');
                setMediaFiles([]);
                setPreviews([]);
                setIsVideo(false);
                setIsExpanded(false);
                onPostCreated?.();
            } else {
                const errText = await res.text();
                alert('Post failed: ' + errText);
            }
        } catch (err) {
            console.error('Error posting:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100"
        >
            <div className="flex items-center justify-between mb-5">
                <motion.h2
                    className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Create a New Post
                </motion.h2>
                <motion.div
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <Send fontSize="small" />
                </motion.div>
            </div>

            <div className="border-b border-gray-200 mb-5"></div>

            <form onSubmit={handleSubmit}>
                <motion.div
                    layout
                    transition={{ duration: 0.3 }}
                    className={`relative border ${isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200'} rounded-lg mb-4`}
                >
                    <textarea
                        ref={textareaRef}
                        className="w-full p-4 rounded-lg focus:outline-none transition-all duration-300 resize-none"
                        rows={isExpanded ? "4" : "2"}
                        placeholder="What's on your mind?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onFocus={handleFocus}
                    />
                    <motion.div
                        className="absolute bottom-2 right-2 cursor-pointer text-gray-500"
                        whileHover={{ scale: 1.1 }}
                    >
                        <Mood />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center mb-4 gap-4">
                                <div className="flex-1">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={isVideo}
                                            onChange={(e) => {
                                                setIsVideo(e.target.checked);
                                                setMediaFiles([]);
                                                setPreviews([]);
                                            }}
                                        />
                                        <div className={`relative w-10 h-5 bg-gray-200 rounded-full transition-colors duration-300 ease-in-out ${isVideo ? 'bg-blue-500' : ''}`}>
                                            <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${isVideo ? 'transform translate-x-5' : ''}`}></div>
                                        </div>
                                        <span className="ml-2 text-gray-700">Video Post</span>
                                    </label>
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center shadow-md"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {isVideo ? <VideoLibrary className="mr-2" /> : <Image className="mr-2" />}
                                    <span>{isVideo ? 'Upload Video' : 'Upload Images'}</span>
                                </motion.button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept={isVideo ? 'video/*' : 'image/*'}
                                    multiple={!isVideo}
                                    onChange={handleMediaChange}
                                />
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                {isVideo ? 'Upload 1 video' : 'Upload up to 3 images'}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {previews.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4 grid grid-cols-3 gap-4"
                        >
                            {previews.map((preview, index) => (
                                <motion.div
                                    key={index}
                                    className="relative rounded-lg overflow-hidden shadow-md"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                    {isVideo ? (
                                        <video
                                            src={preview}
                                            className="w-full h-32 object-cover"
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                    )}
                                    <motion.button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                        whileHover={{ scale: 1.2, backgroundColor: "#f05252" }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Close fontSize="small" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="flex justify-end mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.button
                                type="submit"
                                className={`px-6 py-2.5 rounded-lg flex items-center justify-center min-w-24 ${
                                    isLoading || mediaFiles.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:shadow-xl'
                                }`}
                                disabled={isLoading || mediaFiles.length === 0}
                                whileHover={mediaFiles.length > 0 ? { scale: 1.05 } : {}}
                                whileTap={mediaFiles.length > 0 ? { scale: 0.95 } : {}}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <span className="mr-2">Post</span>
                                        <UploadFile />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    );
};

export default CreatePost;