// src/api/generatedClient.ts
import { Api } from './generated-api';

// Используется для Tauri (prod) и собранного PWA.
const ZEROTIER_IP = "10.111.255.45"; 
const PORT = "8082";

// ЛОГИКА:
// Dev (браузер): '' -> запрос идет как /api/..., прокси перехватывает.
// Prod (Tauri): http://IP:PORT -> запрос идет напрямую на бэкенд.
const BASE_URL = import.meta.env.DEV 
  ? '' 
  : `http://${ZEROTIER_IP}:${PORT}`;

console.log("[GeneratedClient] Current Backend URL:", BASE_URL || "Proxy (relative)");

export const generatedApi = new Api({
  baseURL: BASE_URL,
});

generatedApi.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
