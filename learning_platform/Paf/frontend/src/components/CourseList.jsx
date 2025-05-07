import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Box,
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip,
  Container,
  Divider,
  Fade,
  Skeleton,
  Button,
  Paper,
  Badge,
  Avatar,
  IconButton,
  InputBase,
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  Tooltip,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Styled components
const CourseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 16px 30px rgba(0,0,0,0.12)',
  },
}));

const CourseImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
  },
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
});

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid #e0e0e0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const CategoryButton = styled(Button)(({ theme, active }) => ({
  borderRadius: theme.spacing(3),
  margin: theme.spacing(0.5),
  fontWeight: 600,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
  },
}));

const RatingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ffb400',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    padding: '0 4px',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(0, 0, 4, 4),
  marginBottom: theme.spacing(6),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.2,
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const StatsIconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: alpha(color, 0.1),
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    avatar: "/api/placeholder/40/40",
    text: "This platform completely transformed my career path. The courses are practical and immediately applicable to real-world scenarios."
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    avatar: "/api/placeholder/40/40",
    text: "The instructors are top-notch professionals who don't just teach theory but provide valuable industry insights."
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    avatar: "/api/placeholder/40/40",
    text: "I've tried many learning platforms, but this one stands out for its engaging content and supportive community."
  }
];

const CourseList = () => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [saved, setSaved] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSave = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterCourses = () => {
    let filtered = [...courses];
    
    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(course => course.popular);
    } else if (tabValue === 2) {
      filtered = filtered.filter(course => course.trending);
    } else if (tabValue === 3) {
      filtered = filtered.filter(course => course.new);
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(course => 
        course.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredCourses = filterCourses();

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1">
          Please check your connection or try again later.
        </Typography>
      </Container>
    );
  }

  const LoadingSkeleton = () => (
    <Grid container spacing={4}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', height: '100%' }}>
            <Skeleton variant="rectangular" height={220} animation="wave" />
            <CardContent>
              <Skeleton animation="wave" height={32} width="80%" />
              <Skeleton animation="wave" height={20} width="100%" />
              <Skeleton animation="wave" height={20} width="90%" />
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Skeleton animation="wave" height={24} width={80} />
                <Skeleton animation="wave" height={24} width={80} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            Learning Platform
          </Typography>
          <SearchBar>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search courses, topics, or instructors..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBar>
        </Toolbar>
      </AppBar>

      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 2,
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    Unlock Your Potential with Expert-Led Courses
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
                    Join thousands of students already learning on our platform. 
                    Start your journey toward mastery today.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      fontWeight: 600, 
                      borderRadius: 3,
                      boxShadow: '0 8px 16px rgba(255,255,255,0.2)'
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Explore All Courses
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                {/* This would be where a hero image would go */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("/api/placeholder/600/400")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <StatsCard>
              <StatsIconWrapper color={theme.palette.primary.main}>
                <CheckCircleIcon fontSize="large" color="primary" />
              </StatsIconWrapper>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>10,000+</Typography>
              <Typography variant="subtitle1" color="text.secondary">Successful Graduates</Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard>
              <StatsIconWrapper color={theme.palette.secondary.main}>
                <LocalFireDepartmentIcon fontSize="large" color="secondary" />
              </StatsIconWrapper>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>200+</Typography>
              <Typography variant="subtitle1" color="text.secondary">Expert Instructors</Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard>
              <StatsIconWrapper color="#f44336">
                <StarIcon fontSize="large" sx={{ color: '#f44336' }} />
              </StatsIconWrapper>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>4.8/5</Typography>
              <Typography variant="subtitle1" color="text.secondary">Average Course Rating</Typography>
            </StatsCard>
          </Grid>
        </Grid>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            mb: 6, 
            
          }}
        >
        
          
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Browse Our Courses
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab icon={<CategoryIcon />} iconPosition="start" label="All Courses" />
            <Tab icon={<StarIcon />} iconPosition="start" label="Most Popular" />
            <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Trending" />
            <Tab icon={<NewReleasesIcon />} iconPosition="start" label="New Releases" />
          </Tabs>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
            <CategoryButton 
              active={activeCategory === 'all'} 
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </CategoryButton>
            {['Programming', 'Business Intelligence', 'Mobile Development', 'AI', 'Data Science'].map((category) => (
              <CategoryButton 
                key={category}
                active={activeCategory === category.toLowerCase()} 
                onClick={() => handleCategoryChange(category.toLowerCase())}
              >
                {category}
              </CategoryButton>
            ))}
          </Box>
        </Box>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {filteredCourses.length > 0 ? (
              <Grid container spacing={4}>
                {filteredCourses.map((course, index) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Fade in={true} timeout={500 + index * 100}>
                      <Box>
                        <StyledLink to={`/courses/${course.id}`}>
                          <CourseCard>
                            <Box sx={{ position: 'relative' }}>
                              <CourseImage
                                component="img"
                                image={`http://localhost:8085${course.imagePath}`}
                                alt={course.title}
                              />
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 12, 
                                  left: 12, 
                                  display: 'flex', 
                                  gap: 1 
                                }}
                              >
                                {course.new && (
                                  <Chip 
                                    label="NEW" 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: '#ff4081', 
                                      color: 'white',
                                      fontWeight: 600 
                                    }} 
                                  />
                                )}
                                {course.trending && (
                                  <Chip 
                                    icon={<TrendingUpIcon sx={{ color: 'white !important', fontSize: 16 }} />} 
                                    label="TRENDING" 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: '#7c4dff', 
                                      color: 'white',
                                      fontWeight: 600,
                                      '& .MuiChip-icon': {
                                        color: 'white',
                                      },
                                    }} 
                                  />
                                )}
                              </Box>
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 12, 
                                  right: 12,
                                  zIndex: 1
                                }}
                              >
                                <Tooltip title={saved[course.id] ? "Saved" : "Save for later"}>
                                  <IconButton 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: 'white', 
                                      '&:hover': { bgcolor: 'white' },
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    onClick={(e) => handleSave(course.id, e)}
                                  >
                                    {saved[course.id] ? (
                                      <BookmarkIcon sx={{ color: theme.palette.primary.main }} />
                                    ) : (
                                      <BookmarkBorderIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              <Box 
                                sx={{ 
                                  position: 'absolute',
                                  bottom: 12,
                                  right: 12,
                                  zIndex: 1
                                }}
                              >
                                <RatingBadge badgeContent={course.rating || '4.8'}>
                                  <StarIcon sx={{ color: '#ffb400' }} />
                                </RatingBadge>
                              </Box>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                              <Typography 
                                variant="h6" 
                                component="h2" 
                                gutterBottom 
                                sx={{ 
                                  fontWeight: 600,
                                  lineHeight: 1.3,
                                  fontSize: '1.25rem'
                                }}
                              >
                                {course.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ mb: 2, minHeight: '3em' }}
                              >
                                {course.description?.slice(0, 80)}
                                {course.description?.length > 80 ? '...' : ''}
                              </Typography>
                              
                              <Divider sx={{ my: 2 }} />
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
                                  <Avatar 
                                    src={course.instructorAvatar || "/api/placeholder/40/40"} 
                                    alt={course.instructor}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {course.instructor}
                                  </Typography>
                                </Box>
                                
                                <InfoChip 
                                  icon={<CategoryIcon />} 
                                  label={course.skill} 
                                  size="small" 
                                  color="secondary"
                                  variant="outlined"
                                />
                                {course.duration && (
                                  <InfoChip 
                                    icon={<AccessTimeIcon />} 
                                    label={course.duration} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </CardContent>
                          </CourseCard>
                        </StyledLink>
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={8}>
                <Typography variant="h5" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search or filter criteria.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default CourseList;