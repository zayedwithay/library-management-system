import axios from 'axios';

// Determine the base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request/response (e.g., adding auth tokens)
/*
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token'); // Example: get token from storage
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/

export default apiClient;

