import type { ILanguage } from '../data/mockLanguages';

import { fetch } from '@tauri-apps/plugin-http'; 
// ------------------------------------------------------

// Настройка адреса:
// В dev (браузер) -> прокси. В prod (exe) -> прямой адрес к Go.
const SERVER_URL = import.meta.env.DEV ? '' : 'http://localhost:8082';
const API_BASE_URL = `${SERVER_URL}/api`;

export interface IFilterParams {
  name?: string;
  family?: string;
  writingFamily?: string;
}

/**
 * Получает список языков.
 */
export const getLanguages = async (params: IFilterParams, fallbackData: ILanguage[]): Promise<ILanguage[]> => {
  const queryParams = new URLSearchParams();

  if (params.name) queryParams.append('name', params.name);
  if (params.family) queryParams.append('family', params.family);
  if (params.writingFamily) queryParams.append('writingFamily', params.writingFamily);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  try {
    // AbortController может конфликтовать с плагином в некоторых версиях.
    // Если будет падать ошибка "signal not implemented", убрать signal из fetch.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/langs${queryString}`, {
      method: 'GET',
      // signal: controller.signal, // <-- Раскомментируй, если работает. Если падает — закомментируй.
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    console.log(`Data fetched from backend with query: ${queryString}`);
    return response.json();
  } catch (error) {
    console.warn("Backend request failed. Falling back to mock data.", error);
    return fallbackData;
  }
};

/**
 * Получает один язык по ID.
 */
export const getLanguageById = async (id: string): Promise<ILanguage> => {
  const response = await fetch(`${API_BASE_URL}/langs/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Language with id ${id} not found`);
  }
  return response.json();
};

export interface ICartStatus {
  count: number;
  userID: number;
}

/**
 * Получает статус корзины.
 */
export const getCartStatus = async (): Promise<ICartStatus> => {
  const token = localStorage.getItem('token');
  
  // Типизация заголовков для плагина может быть строгой
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lang-calculation/draft/count`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.error("Ошибка при получении корзины");
      return { count: 0, userID: -1 };
    }

    return response.json();
  } catch (error) {
    console.error("Network error fetching cart:", error);
    return { count: 0, userID: -1 };
  }
};
