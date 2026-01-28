// src/api/languagesApi.ts
import type { ILanguage } from '../data/mockLanguages';

const API_BASE_URL = '/api';

// --- ИЗМЕНЕНИЯ ЗДЕСЬ: Добавляем новые поля в интерфейс ---
export interface IFilterParams {
  name?: string;
  family?: string;
  writingFamily?: string;
}
// ---------------------------------------------------------

/**
 * Получает список языков с бэкенда с учетом фильтров.
 */
export const getLanguages = async (params: IFilterParams, fallbackData: ILanguage[]): Promise<ILanguage[]> => {
  const queryParams = new URLSearchParams();

  // --- ИЗМЕНЕНИЯ ЗДЕСЬ: Добавляем параметры в запрос, если они есть ---
  if (params.name) {
    queryParams.append('name', params.name);
  }
  if (params.family) {
    queryParams.append('family', params.family);
  }
  if (params.writingFamily) {
    queryParams.append('writingFamily', params.writingFamily);
  }
  // -------------------------------------------------------------------
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/langs${queryString}`, {
      signal: controller.signal
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
 * Получает один язык по его ID.
 * @param id - ID языка.
 * @returns {Promise<ILanguage>} - Объект языка.
 */
export const getLanguageById = async (id: string): Promise<ILanguage> => {
  const response = await fetch(`${API_BASE_URL}/langs/${id}`);

  if (!response.ok) {
    throw new Error(`Language with id ${id} not found`);
  }

  return response.json();
};


// Интерфейс ответа от сервера
export interface ICartStatus {
  count: number;
  userID: number;
}

/**
 * Получает статус корзины.
 * Если токен есть в localStorage, отправляет его (вернется реальный count).
 * Если токена нет, отправляет без него (вернется count: 0, userID: -1).
 */
export const getCartStatus = async (): Promise<ICartStatus> => {
  // 1. Пытаемся найти токен (предположим, вы сохраняете его при логине под ключом 'token')
  const token = localStorage.getItem('token');

  // 2. Формируем заголовки
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Если токен есть, добавляем его
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Делаем запрос
  const response = await fetch(`${API_BASE_URL}/lang-calculation/draft/count`, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    console.error("Ошибка при получении корзины");
    // Возвращаем дефолтное значение для гостя в случае ошибки сети
    return { count: 0, userID: -1 };
  }

  return response.json();
};