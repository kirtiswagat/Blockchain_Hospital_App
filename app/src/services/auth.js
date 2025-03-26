// app/src/services/authService.js
import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  
  // Store token in localStorage
  localStorage.setItem('token', token);
  
  return { token, user };
};

export const logout = () => {
  localStorage.removeItem('token');
  return api.post('/auth/logout');
};

export const checkAuth = async () => {
  return api.get('/auth/verify');
};