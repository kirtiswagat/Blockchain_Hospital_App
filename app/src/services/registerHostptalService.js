// services/userService.js
import api from './api';

export const Hospital = async (userData) => {
  const token = localStorage.getItem('token');
  
  // Making the request with explicit token
  const response = await api.post('/hospitals', userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};
export const getHospital= async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await api.get('/hospitals', { params, headers: {
    Authorization: `Bearer ${token}`
  } } );
  return response.data;
};

export const HospitalById = async (id) => {
  const response = await api.get(`/hospitals/${id}`);
  return response.data;
};


export const updateHospital = async (id, userData) => {
  const response = await api.put(`/hospitals/${id}`, userData);
  return response.data;
};

export const deleteHospital = async (id) => {
  const response = await api.delete(`/hospitals/${id}`);
  return response.data;
};