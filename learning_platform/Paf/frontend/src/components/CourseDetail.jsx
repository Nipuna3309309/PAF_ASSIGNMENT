import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Button,
  Divider,
  Paper,
  Skeleton,
  Alert,
  Breadcrumbs,
  Rating,
  styled
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  SignalCellularAlt as LevelIcon,
  Book as BookIcon,
  Code as CodeIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

// Styled components
const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  marginBottom: theme.spacing(3),
  transition: 'color 0.2s',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const CourseImage = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const ResourceButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
}));

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8085/api/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <StyledLink to="/courses">
          <ArrowBackIcon sx={{ mr: 1 }} /> Back to Course List
        </StyledLink>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <StyledLink to="/courses">
          <ArrowBackIcon sx={{ mr: 1 }} /> Back to Course List
        </StyledLink>
        <Box mb={4}>
          <Skeleton variant="text" height={60} width="70%" />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            <Box mt={3}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit' }}>
          Courses
        </Link>
        <Typography color="text.primary">{course.title}</Typography>
      </Breadcrumbs>

      <StyledLink to="/courses">
        <ArrowBackIcon sx={{ mr: 1 }} /> Back to Course List
      </StyledLink>

      <Box mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', 
          }}
        >
          {course.title}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <Chip 
            icon={<PersonIcon />} 
            label={`Instructor: ${course.instructor}`} 
            color="primary" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<LevelIcon />} 
            label={`${course.level || 'Beginner'}`} 
            color="secondary" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Rating value={4.5} readOnly precision={0.5} size="small" />
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CourseImage
              image={`http://localhost:8085${course.imagePath}`}
              title={course.title}
            />
          </Card>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Course Overview
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
            {course.description}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              What You'll Learn
            </Typography>
            <Grid container spacing={2}>
              {['Problem solving', 'Critical thinking', 'Practical skills', 'Industry knowledge'].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                      borderRadius: 2
                    }}
                  >
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>{item}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <InfoCard>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Course Information
            </Typography>

            <InfoItem>
              <CategoryIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">
                  {course.category || 'General'}
                </Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <CodeIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Skill
                </Typography>
                <Typography variant="body1">
                  {course.skill || 'Various'}
                </Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <LevelIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Level
                </Typography>
                <Typography variant="body1">
                  {course.level || 'Beginner'}
                </Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <LanguageIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Language
                </Typography>
                <Typography variant="body1">
                  {course.language || 'English'}
                </Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <AccessTimeIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {course.duration || 'Self-paced'}
                </Typography>
              </Box>
            </InfoItem>

            <InfoItem>
              <BookIcon />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Module
                </Typography>
                <Typography variant="body1">
                  {course.name || 'Main Course'}
                </Typography>
              </Box>
            </InfoItem>

            <Divider sx={{ my: 3 }} />

            <ResourceButton
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<LaunchIcon />}
              href={course.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Access Course Materials
            </ResourceButton>
          </InfoCard>
        </Grid>
      </Grid>
    </Container>
  );
};

// Import this icon separately since it's not imported at the top
const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#1976D2"/>
  </svg>
);

export default CourseDetails;