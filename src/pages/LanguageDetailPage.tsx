// src/pages/LanguageDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import styles from './LanguageDetailPage.module.css';
import type { ILanguage } from '../data/mockLanguages';
import { getLanguageById } from '../api/languagesApi'; // <-- Импортируем нашу новую функцию



export const LanguageDetailPage = () => {
  // useParams() достает id из URL (например, '123' из '/languages/123')
  const { id } = useParams<{ id: string }>();

  // --- Состояния для данных, загрузки и ошибки ---
  const [language, setLanguage] = useState<ILanguage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Эффект для загрузки данных ---
  useEffect(() => {
    // Проверяем, что id действительно есть в URL, прежде чем делать запрос
    if (!id) {
      setError("ID языка не указан в URL.");
      setIsLoading(false);
      return;
    }

    const fetchLanguage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLanguageById(id);
        setLanguage(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguage();
  }, [id]); // Зависимость от 'id': эффект перезапустится, если id в URL изменится

  // --- Рендеринг в зависимости от состояния ---

  if (isLoading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Если язык не загружен, но и ошибки нет (маловероятно, но хорошая практика)
  if (!language) {
    return <Alert variant="warning">Данные о языке не найдены.</Alert>;
  }

  // --- Финальный рендеринг, когда все данные есть ---
  return (
    <div className={styles.portraitContainer}>
      {/* Показываем видео, только если для него есть URL */}
      {language.videoURL && (
        <video
          className={styles.videoBackground}
          src={language.videoURL}
          autoPlay
          loop
          muted
          playsInline // Важно для автопроигрывания на мобильных устройствах
        />
      )}
      
      <div className={styles.overlayContent}>
        <h2>{language.name}</h2>
        <p><strong>Семья:</strong> {language.family}</p>
        <p><strong>Подгруппа:</strong> {language.subgroup}</p>
        <p>{language.description}</p>
      </div>
    </div>
  );
};
