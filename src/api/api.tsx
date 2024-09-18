// src/api.js
import axios from 'axios';
import API_BASE_URL from './apiConfig'; // فایل apiConfig.js را ایمپورت کنید

// ایجاد نمونه‌ای از axios با تنظیمات پایه
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // انتقال withCredentials به سطح بالا
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default api;
