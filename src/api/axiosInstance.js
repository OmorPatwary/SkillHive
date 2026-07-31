import axios from 'axios';

// ১. বেস ইউআরএল সেটআপ
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // আপনার Node.js সার্ভারের ইউআরএল
});

// ২. Request Interceptor (লগইন করা থাকলে অটোমেটিকJWT টোকেন হেডারে পাঠাবে)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;