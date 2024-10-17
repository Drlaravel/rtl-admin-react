
import axios from 'axios';
import API  from './apiConfig';

const apiWhitoutendpont = axios.create({
    baseURL: API.API_BASE_URI,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiWhitoutendpont.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
     
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
);

// افزودن اینترسپتور برای پاسخ‌ها جهت مدیریت خطاها
apiWhitoutendpont.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {

            console.error('Unauthorized - Please log in again');

        }
        return Promise.reject(error);
    }
);

export default apiWhitoutendpont;
