import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Avatar,
    Grid,
    Paper
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import PostAddIcon from '@mui/icons-material/PostAdd';

const Dashboard = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            setUser({
                firstName: decodedToken.firstName || localStorage.getItem('firstName') || 'User',
                lastName: decodedToken.lastName || localStorage.getItem('lastName') || '',
                email: decodedToken.email || localStorage.getItem('email') || ''
            });
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage items
        navigate('/login');
    };

    const handleAddPost = () => {
        navigate('/post');
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            mb: 3,
                            bgcolor: 'primary.main',
                            fontSize: '2.5rem'
                        }}
                    >
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </Avatar>

                    <Typography variant="h4" component="h1" gutterBottom>
                        {user.firstName} {user.lastName}
                    </Typography>

                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography variant="body1" sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                            {user.email}
                        </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<PostAddIcon />}
                                onClick={handleAddPost}
                                sx={{ py: 1.5 }}
                            >
                                New Post
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={handleLogout}
                                sx={{ py: 1.5 }}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;