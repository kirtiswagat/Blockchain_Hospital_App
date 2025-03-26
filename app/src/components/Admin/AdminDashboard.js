// components/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress 
} from '@mui/material';

const StatCard = ({ title, value, color }) => (
  <Card sx={{ bgcolor: color, color: 'white', height: '100%' }}>
    <CardContent>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  // Mock data - in a real app, you would fetch this from an API
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        hospitals: {
          total: 24,
          active: 18,
          inactive: 6
        },
        users: {
          total: 156,
          active: 132,
          inactive: 24
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hospital Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <StatCard title="Total Hospitals" value={stats.hospitals.total} color="#1976d2" />
              </Grid>
              <Grid item xs={4}>
                <StatCard title="Active Hospitals" value={stats.hospitals.active} color="#4caf50" />
              </Grid>
              <Grid item xs={4}>
                <StatCard title="Inactive Hospitals" value={stats.hospitals.inactive} color="#f44336" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <StatCard title="Total Users" value={stats.users.total} color="#1976d2" />
              </Grid>
              <Grid item xs={4}>
                <StatCard title="Active Users" value={stats.users.active} color="#4caf50" />
              </Grid>
              <Grid item xs={4}>
                <StatCard title="Inactive Users" value={stats.users.inactive} color="#f44336" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;