// components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  Alert 
} from '@mui/material';

import {login} from '../services/auth'

const LoginPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setEmail('');
    setPassword('');
    setError('');
  };

  const getRoleFromTabIndex = (index) => {
    switch(index) {
      case 0: return 'admin';
      case 1: return 'hospital';
      case 2: return 'user';
      default: return 'admin';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const role = getRoleFromTabIndex(activeTab);

    // In a real app, you would make an API call to authenticate
    // This is just a simulation
    const data= await login({email,password,role})
    if (data.user) {
      onLogin(role);
      // Redirect based on role
      navigate(`/${role}`);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Healthcare Blockchain Platform
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="login tabs" centered>
            <Tab label="Admin" />
            <Tab label="Hospital" />
            <Tab label="User" />
          </Tabs>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login as {getRoleFromTabIndex(activeTab).charAt(0).toUpperCase() + getRoleFromTabIndex(activeTab).slice(1)}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;