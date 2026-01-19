import type { ILanguage } from '../data/mockLanguages';

const API_BASE_URL = '/api';

/**
 * Получает список языков с бэкенда.
 * @param fallbackData - Данные, которые будут возвращены в случае ошибки запроса.
 * @returns {Promise<ILanguage[]>} - Промис, который разрешается в массив языков.
 */
export const getLanguages = async (fallbackData: ILanguage[]): Promise<ILanguage[]> => {
  try {
    // Пытаемся сделать запрос к реальному API.
    // установим короткий тайм-аут, чтобы не ждать долго, если сервер "мертв".
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд тайм-аут

    const response = await fetch(`${API_BASE_URL}/langs`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Отменяем тайм-аут, если ответ пришел вовремя

    // Если ответ не "200 OK", это тоже ошибка.
    if (!response.ok) {
      // Выбрасываем ошибку, чтобы перейти в блок catch.
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Если все прошло успешно, возвращаем реальные данные.
    console.log("Data fetched from backend");
    return response.json();

  } catch (error) {
    // Если в блоке try произошла ЛЮБАЯ ошибка (сервер выключен, 404, тайм-аут),
    // мы "ловим" ее здесь.
    console.warn("Backend request failed. Falling back to mock data.", error);
    
    // Возвращаем "запасные" mock-данные.
    return fallbackData;
  }
};