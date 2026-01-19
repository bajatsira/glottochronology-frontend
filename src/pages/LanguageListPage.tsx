// src/pages/LanguagesListPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import type { ILanguage } from '../data/mockLanguages';
// Теперь импортируем и IFilterParams
import { getLanguages, type IFilterParams } from '../api/languagesApi'; 
import { mockLanguages } from '../data/mockLanguages';

export const LanguagesListPage = () => {
  // --- Состояния ---
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  
  // --- НОВОЕ: Состояние для хранения АКТИВНЫХ фильтров ---
  const [activeFilters, setActiveFilters] = useState<IFilterParams>({});

  // --- Логика получения данных ---
  // Теперь useEffect зависит от activeFilters. Он будет перезапускаться
  // каждый раз, когда мы устанавливаем новые фильтры.
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      // Передаем активные фильтры в API-функцию
      const data = await getLanguages(activeFilters, mockLanguages);
      setLanguages(data);
      setIsLoading(false);
    };

    fetchLanguages();
  }, [activeFilters]); // <--- ВАЖНО: Зависимость от activeFilters

  // --- Обработчик отправки формы ---
  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Когда пользователь нажимает "Применить", мы обновляем
    // состояние АКТИВНЫХ фильтров. Это, в свою очередь,
    // вызовет перезапуск useEffect и новый запрос на бэкенд.
    setActiveFilters({ name: filterName });
  };

  return (
    <>
      {/* Форма фильтров (без изменений в JSX) */}
      <div className="mb-4 p-3 border rounded">
        <h5>Фильтры</h5>
        <Form onSubmit={handleFilterSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите название..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" type="submit">Применить</Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Отображение данных (добавили проверку на пустой результат) */}
      {isLoading ? (
        <div className="text-center p-5"><Spinner animation="border" /></div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {languages.length > 0 ? (
            languages.map(lang => (
              <Col key={lang.ID}>
                <LanguageCard language={lang} />
              </Col>
            ))
          ) : (
            <p className="text-center">Языки по вашему запросу не найдены.</p>
          )}
        </Row>
      )}
    </>
  );
};
