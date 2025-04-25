import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    AppBar,
    Toolbar,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <>
            {/* Top Navigation Bar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Home
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/create')}>
                        Create Post
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    All Posts
                </Typography>

                {posts.length === 0 ? (
                    <Typography>No posts available yet.</Typography>
                ) : (
                    <Grid container spacing={4}>
                        {posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {post.description}
                                    </Typography>

                                    {post.mediaType === 'IMAGE' && post.imageUrls && (
                                        <Grid container spacing={1}>
                                            {post.imageUrls.map((url, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <img
                                                        src={url}
                                                        alt={`post ${index}`}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}

                                    {post.mediaType === 'VIDEO' && post.videoUrl && (
                                        <Box mt={1}>
                                            <video width="100%" controls style={{ borderRadius: 8 }}>
                                                <source src={post.videoUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default Home;
