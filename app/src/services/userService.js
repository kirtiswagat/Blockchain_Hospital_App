// services/userService.js
import api from './api';

export const createUser = async (userData) => {
  const token = localStorage.getItem('token');
  
  // Making the request with explicit token
  const response = await api.post('/users', userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};


export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};