import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Leaves
export const applyLeave = (data) => API.post('/leaves', data);
export const getMyLeaves = () => API.get('/leaves/my');
export const updateLeave = (id, data) => API.put(`/leaves/${id}`, data);
export const cancelLeave = (id) => API.delete(`/leaves/${id}`);
export const getAllLeaves = () => API.get('/leaves/all');
export const reviewLeave = (id, status) => API.put(`/leaves/${id}/review`, { status });

// Attendance
export const markAttendance = (data) => API.post('/attendance', data);
export const getMyAttendance = () => API.get('/attendance/my');
export const getTodayAttendance = () => API.get('/attendance/today');
export const getAllAttendance = (params) => API.get('/attendance/all', { params });

// Users (Admin)
export const getAllUsers = () => API.get('/users');

export default API;
