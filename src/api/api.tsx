
import axios from 'axios';
import API_BASE_URL from './apiConfig';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
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

// افزودن اینترسپتور برای پاسخ‌ها جهت مدیریت خطاها
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {

            console.error('Unauthorized - Please log in again');

        }
        return Promise.reject(error);
    }
);

export default api;
