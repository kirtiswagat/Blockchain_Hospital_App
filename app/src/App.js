// App.js - Main component
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Components
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLayout from './components/Admin/AdminLayout';
import RegisterHospital from './components/Admin/RegisterHospital';
import RegisterUser from './components/Admin/RegisterUser';
import ViewHospitals from './components/Admin/ViewHospitals';
import ViewUsers from './components/Admin/ViewUsers';
import BlockchainConnect from './components/Admin/BlockchainConnect';
import HospitalDashboard from './components/Hospital/HospitalDashboard';
import UserDashboard from './components/User/UserDashboard';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Simulating authentication
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
  };

  // Protected route component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated || userRole !== allowedRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="register-hospital" element={<RegisterHospital />} />
            <Route path="register-user" element={<RegisterUser />} />
            <Route path="view-hospitals" element={<ViewHospitals />} />
            <Route path="view-users" element={<ViewUsers />} />
            <Route path="blockchain" element={<BlockchainConnect />} />
          </Route>
          
          {/* Hospital Routes */}
          <Route 
            path="/hospital" 
            element={
              <ProtectedRoute allowedRole="hospital">
                <HospitalDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          {/* User Routes */}
          <Route 
            path="/user" 
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

