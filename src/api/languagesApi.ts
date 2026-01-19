// src/api/languagesApi.ts
import type { ILanguage } from '../data/mockLanguages';


const API_BASE_URL = '/api';

// Создаем интерфейс для объекта с параметрами фильтрации
export interface IFilterParams {
  name?: string;
  // Здесь можно будет добавить другие фильтры: date_from, date_to и т.д.
}

/**
 * Получает список языков с бэкенда с учетом фильтров.
 * @param params - Объект с параметрами фильтрации.
 * @param fallbackData - Данные для отката в случае ошибки.
 * @returns {Promise<ILanguage[]>} - Массив языков.
 */
export const getLanguages = async (params: IFilterParams, fallbackData: ILanguage[]): Promise<ILanguage[]> => {
  // --- НОВАЯ ЛОГИКА ---
  // Создаем объект URLSearchParams для удобной работы с query-параметрами
  const queryParams = new URLSearchParams();

  // Если в params есть имя, добавляем его в query-строку
  if (params.name) {
    queryParams.append('name', params.name);
  }
  
  // Превращаем параметры в строку. Результат: "?name=кубачинский" или ""
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  // --------------------

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Добавляем queryString к нашему URL
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
    // ВАЖНО: Если бэкенд упал, мы не можем фильтровать моки.
    // Просто вернем все моки, или можно добавить простую фильтрацию моков здесь.
    // Для простоты - возвращаем все.
    return fallbackData;
  }
};



/**
 * Получает один язык по его ID.
 * @param id - ID языка.
 * @returns {Promise<ILanguage>} - Объект языка.
 */
export const getLanguageById = async (id: string): Promise<ILanguage> => {
  // Отправляем запрос на /api/langs/{id}. Благодаря proxy, он уйдет куда нужно.
  const response = await fetch(`${API_BASE_URL}/langs/${id}`);

  if (!response.ok) {
    // Если язык не найден, бэкенд вернет 404, и мы попадем сюда.
    throw new Error(`Language with id ${id} not found`);
  }

  return response.json();
};
