import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000
});

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login'))
        window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
