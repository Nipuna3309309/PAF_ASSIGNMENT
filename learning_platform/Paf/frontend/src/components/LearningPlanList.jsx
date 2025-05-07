import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Fade,
  Skeleton,
  Tab,
  Tabs,
  Divider,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Lightbulb as LightbulbIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import axios from 'axios';

// AI-powered component for personalized recommendations
const AIRecommendations = ({ userId, interests, completedPlans }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  

  
  
};

// AI Analytics component
const LearningAnalytics = ({ userId, plans }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate simple analytics from plans data
    if (plans && plans.length > 0) {
      const totalPlans = plans.length;
      const completedPlans = plans.filter(plan => 
        plan.tasks && plan.tasks.length > 0 && plan.tasks.every(task => task.completed)
      ).length;
      
      const completionRate = totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;
      
      // Estimate learning time
      const estimatedHours = plans.reduce((total, plan) => {
        // Simple estimation: 2 hours per task
        const planHours = plan.tasks ? plan.tasks.length * 2 : 5;
        return total + planHours;
      }, 0);
      
      // Calculate learning streak (placeholder logic)
      const streak = Math.min(7, Math.floor(Math.random() * 8));
      
      setAnalytics({
        completionRate,
        totalPlans,
        completedPlans,
        estimatedHours,
        streak
      });
      
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [plans, userId]);

  if (loading) {
    return <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Learning Analytics</Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {analytics.completedPlans}/{analytics.totalPlans}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plans Completed
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {Math.round(analytics.completionRate)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {analytics.estimatedHours}h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learning Time
            </Typography>
          </Box>
        </Grid>
        
        
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          component={Link}
          to="/analytics"
        >
          View detailed analytics
        </Button>
      </Box>
    </Paper>
  );
};

// Enhanced main component
const LearningPlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const navigate = useNavigate();

  // Simulated user preferences for AI recommendations
  const userInterests = ['machine learning', 'web development', 'data science'];
  
  useEffect(() => {
    axios.get(`http://localhost:8085/api/learningplans/${userId}`)
      .then((res) => {
        // Add some additional properties for enhanced functionality
        const enhancedPlans = res.data.map(plan => ({
          ...plan,
          bookmarked: Math.random() > 0.7, // Random bookmark status for demo
          progress: calculateProgress(plan),
          lastAccessed: generateRandomDate(),
          aiGeneratedTags: generateAITags(plan)
        }));
        
        setPlans(enhancedPlans);
        setFilteredPlans(enhancedPlans);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch learning plans:', err);
        setLoading(false);
      });
  }, [userId]);

  // Update filtered plans when search term changes
  useEffect(() => {
    let result = plans;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.background && plan.background.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.aiGeneratedTags && plan.aiGeneratedTags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    // Filter by tab value
    if (tabValue === 1) { // In Progress
      result = result.filter(plan => plan.progress < 100);
    } else if (tabValue === 2) { // Completed
      result = result.filter(plan => plan.progress === 100);
    } else if (tabValue === 3) { // Recent
      result = [...result].sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
    }
    
    // Filter by bookmarked status
    if (bookmarkedOnly) {
      result = result.filter(plan => plan.bookmarked);
    }
    
    setFilteredPlans(result);
  }, [searchTerm, plans, tabValue, bookmarkedOnly]);

  // Helper functions
  const calculateProgress = (plan) => {
    if (!plan.tasks || plan.tasks.length === 0) return 0;
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / plan.tasks.length) * 100);
  };

  const generateRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 14); // Random date within last 14 days
    return new Date(now.setDate(now.getDate() - daysAgo));
  };

  const generateAITags = (plan) => {
    // Simulate AI-generated tags based on plan content
    const allTags = [
      'beginner', 'intermediate', 'advanced', 
      'programming', 'design', 'data science', 
      'web development', 'machine learning', 'self-improvement',
      'career', 'technology', 'business', 'art'
    ];
    
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const planTags = [];
    
    for (let i = 0; i < numTags; i++) {
      const randomIndex = Math.floor(Math.random() * allTags.length);
      if (!planTags.includes(allTags[randomIndex])) {
        planTags.push(allTags[randomIndex]);
      }
    }
    
    return planTags;
  };

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`;
  };

  const getEstimatedTime = (plan) => {
    return `${Math.floor(Math.random() * 10) + 1} hours`;
  };

  const isPlanCompleted = (plan) => {
    return plan.progress === 100;
  };

  const toggleBookmark = (planId) => {
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId ? { ...plan, bookmarked: !plan.bookmarked } : plan
      )
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleBookmarkedFilter = () => {
    setBookmarkedOnly(!bookmarkedOnly);
    handleMenuClose();
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Learning Plans
        </Typography>
        
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 4 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Your Learning Plans
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/courses"
            startIcon={<SchoolIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Course List
          </Button>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/create"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            Create New Plan
          </Button>
        </Box>
      </Box>

      {/* Analytics section */}
      <LearningAnalytics userId={userId} plans={plans} />
      
      {/* AI Recommendations section */}
      {plans.length > 0 && (
        <AIRecommendations 
          userId={userId} 
          interests={userInterests} 
          completedPlans={plans.filter(p => p.progress === 100)}
        />
      )}

      {/* Empty state */}
      {plans.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: '#f8f9fa',
            border: '1px dashed #ccc'
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No learning plans found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first learning plan to get started on your educational journey.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/create"
            startIcon={<AddIcon />}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Create Your First Plan
          </Button>
        </Paper>
      ) : (
        <>
          {/* Search and filter section */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              placeholder="Search plans..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: 300, borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box>
              <Button
                size="small"
                startIcon={<FilterListIcon />}
                onClick={handleMenuOpen}
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={toggleBookmarkedFilter}>
                  {bookmarkedOnly ? 'Show All' : 'Bookmarked Only'}
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  Sort by Date Created
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  Sort by Progress
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Tabs section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="All Plans" />
              <Tab label="In Progress" />
              <Tab label="Completed" />
              <Tab label="Recent" />
            </Tabs>
          </Box>
          
          {/* Display filtering results */}
          {filteredPlans.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
              No plans match your current filters. Try adjusting your search or filter settings.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredPlans.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Fade in={true} timeout={500 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.07)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: 8,
                          backgroundColor: getRandomPastelColor()
                        }}
                      />
                      <CardContent sx={{ pt: 3, pb: 2, px: 3, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {plan.title}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(plan.id);
                            }}
                          >
                            {plan.bookmarked ? 
                              <BookmarkIcon color="primary" fontSize="small" /> : 
                              <BookmarkBorderIcon fontSize="small" />
                            }
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {(plan.background || '').slice(0, 100)}
                          {(plan.background || '').length > 100 ? '...' : ''}
                        </Typography>
                        
                        {/* Progress bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {plan.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={plan.progress} 
                            sx={{ height: 6, borderRadius: 3 }}
                            color={plan.progress === 100 ? "success" : "primary"}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TimerIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {getEstimatedTime(plan)}
                          </Typography>
                        </Box>
                        
                        {/* AI-generated tags */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {plan.aiGeneratedTags && plan.aiGeneratedTags.map((tag, i) => (
                            <Chip
                              key={i}
                              label={tag}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                          
                          <Chip
                            label={isPlanCompleted(plan) ? 'Completed' : 'In Progress'}
                            size="small"
                            color={isPlanCompleted(plan) ? 'success' : 'primary'}
                            variant="outlined"
                            sx={{
                              backgroundColor: isPlanCompleted(plan)
                                ? 'rgba(76, 175, 80, 0.1)' // green
                                : 'rgba(25, 118, 210, 0.05)' // blue
                            }}
                          />
                        </Box>
                      </CardContent>
                      <CardActionArea
                        onClick={() => navigate(`/plan/${plan.id}`)}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(0,0,0,0.08)'
                        }}
                      >
                        <Typography variant="button" color="primary" fontWeight="medium">
                          View Details
                        </Typography>
                        <ArrowForwardIcon fontSize="small" color="primary" />
                      </CardActionArea>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default LearningPlanList;