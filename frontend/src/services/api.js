import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
// Automatically append /api if the provided URL is an absolute URL and missing the /api suffix
const finalBaseUrl = (rawApiUrl.startsWith('http') && !rawApiUrl.endsWith('/api'))
  ? rawApiUrl.replace(/\/+$/, '') + '/api'
  : rawApiUrl;

const api = axios.create({
  baseURL: finalBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
