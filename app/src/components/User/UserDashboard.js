// components/User/UserDashboard.js
import React from 'react';
import { Box, Typography, Paper, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to User Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            This is a placeholder for the User Dashboard. In a complete application, this would show user-specific data and functionality.
          </Typography>
          <Button variant="contained">View Medical Records</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserDashboard;