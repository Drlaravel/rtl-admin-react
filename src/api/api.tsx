// src/api.js
import axios from 'axios';
import API_BASE_URL from './apiConfig'; // فایل apiConfig.js را ایمپورت کنید

// ایجاد نمونه‌ای از axios با تنظیمات پایه
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
