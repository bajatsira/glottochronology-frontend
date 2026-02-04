// src/api/generatedClient.ts
import { Api } from './generated-api';

// Создаем единый экземпляр нашего сгенерированного API-клиента.
// Мы будем использовать его во всех Thunk-ах, связанных с заявками.
export const generatedApi = new Api({
  // Указываем базовый URL, чтобы не писать его в каждом запросе.
  // Прокси Vite сам перенаправит запросы с /api на ваш бэкенд.
  baseURL: '/api',
});

// Этот перехватчик (interceptor) будет автоматически добавлять
// токен авторизации в КАЖДЫЙ запрос, сделанный через 'generatedApi'.
generatedApi.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
