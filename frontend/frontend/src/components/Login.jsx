import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';

const Post = () => {
    const [postContent, setPostContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postContent.trim()) return; // Prevent empty posts

        setIsLoading(true);

        try {
            // Simulate API call (replace with actual fetch)
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Post submitted:', postContent);
            navigate('/dashboard');
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
                        rows={5}
                        variant="outlined"
                        label="Share your thoughts..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!postContent.trim() || isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Post'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Post;