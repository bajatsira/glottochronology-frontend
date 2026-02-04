// src/api/axiosInstance.ts
import axios from 'axios';

export const $api = axios.create({
  baseURL: '/api', // Используем прокси Vite
});

// Интесептор: перед каждым запросом добавляем токен
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
