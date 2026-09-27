import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hms_user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle expired/invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
