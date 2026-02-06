import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

const ZEROTIER_IP = "10.111.255.45"; 
const PORT = "8082";

// Определяем, запущены ли мы внутри Tauri (неважно, dev или prod)
// @ts-ignore
const isTauri = !!window.__TAURI_INTERNALS__;

console.log("[AxiosConfig] Is Tauri Environment:", isTauri);

// Если Tauri -> Стучимся на IP. Если Браузер -> Стучимся на /api (прокси)
const baseURL = isTauri 
  ? `http://${ZEROTIER_IP}:${PORT}/api`
  : '/api';

// --- АДАПТЕР (Тот же, что и был) ---
const tauriAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const makeUrl = (url?: string, base?: string) => {
      if (!url) return base || '';
      if (url.startsWith('http')) return url;
      const cleanBase = base?.endsWith('/') ? base.slice(0, -1) : base;
      const cleanUrl = url.startsWith('/') ? url : `/${url}`;
      return (cleanBase || '') + cleanUrl;
  };

  const fullUrl = makeUrl(config.url, config.baseURL);
  
  const fetchOptions: RequestInit = {
    method: config.method?.toUpperCase(),
    headers: config.headers as Record<string, string>,
    body: config.data && typeof config.data === 'object' 
          ? JSON.stringify(config.data) 
          : config.data,
  };

  // Вызов Rust-плагина (Игнорирует CORS)
  const response = await tauriFetch(fullUrl, fetchOptions);

  const responseData = await response.json().catch(() => null);

  return {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: {}, 
    config: config as InternalAxiosRequestConfig,
    request: {},
  };
};

// --- СОЗДАНИЕ ---
export const $api = axios.create({
  baseURL: baseURL,
  // Включаем адаптер ВСЕГДА, если мы внутри Tauri
  adapter: isTauri ? tauriAdapter : undefined,
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    if (!config.headers['Content-Type'] && config.data) {
        config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
});
