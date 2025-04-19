import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid
} from '@mui/material';

const Post = () => {
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isVideo, setIsVideo] = useState(false);
    const [previewPost, setPreviewPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all posts when the component loads
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data); // Set the posts to state
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);

        if (isVideo) {
            if (files.length > 1) {
                alert('You can only upload 1 video');
                return;
            }
            setMediaFiles(files);
        } else {
            if (files.length > 3) {
                alert('You can only upload up to 3 images');
                return;
            }
            setMediaFiles(files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('isVideo', isVideo);

            mediaFiles.forEach((file) => {
                formData.append('mediaFiles', file);
            });

            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const post = await response.json();
                console.log('Created post:', post);
                setPreviewPost(post); // Set the preview post after creation
                navigate('/dashboard');
            } else {
                const errorText = await response.text();
                alert('Failed to create post: ' + errorText);
            }
        } catch (error) {
            console.error('Error submitting post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Create a New Post
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        label="Post Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Typography variant="subtitle1">
                        Upload media ({isVideo ? '1 video' : 'up to 3 images'}):
                    </Typography>

                    <input
                        type="file"
                        accept={isVideo ? 'video/*' : 'image/*'}
                        multiple={!isVideo}
                        onChange={handleMediaChange}
                        style={{ marginBottom: '1rem' }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isVideo}
                                onChange={(e) => {
                                    setIsVideo(e.target.checked);
                                    setMediaFiles([]); // Clear previous files
                                }}
                            />
                            {' '}Is this a video post?
                        </label>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !mediaFiles.length}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Post'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            {/* Preview Post */}
            {previewPost && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Preview
                    </Typography>

                    {previewPost.mediaType === 'IMAGE' && Array.isArray(previewPost.imageUrls) && (
                        <Grid container spacing={2} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                            {previewPost.imageUrls.map((url, index) => (
                                <Grid item key={index}>
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        style={{ width: '100%', borderRadius: 8 }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {previewPost.mediaType === 'VIDEO' && previewPost.videoUrl && (
                        <Box mt={2}>
                            <video width="100%" controls>
                                <source src={previewPost.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    )}
                </Box>
            )}

            {/* All Posts */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    All Posts
                </Typography>

                {posts.length === 0 ? (
                    <Typography>No posts available.</Typography>
                ) : (
                    posts.map((post) => (
                        <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">{post.description}</Typography>
                            {post.mediaType === 'IMAGE' && Array.isArray(post.imageUrls) && (
                                <Grid container spacing={2} sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                    {post.imageUrls.map((url, index) => (
                                        <Grid item key={index}>
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                style={{ width: '100%', borderRadius: 8 }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {post.mediaType === 'VIDEO' && post.videoUrl && (
                                <Box mt={2}>
                                    <video width="100%" controls>
                                        <source src={post.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </Box>
                            )}
                        </Paper>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default Post;
