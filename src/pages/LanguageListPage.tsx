// src/pages/LanguagesListPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import type { ILanguage } from '../data/mockLanguages';
import { getLanguages } from '../api/languagesApi';
import { mockLanguages } from '../data/mockLanguages';

import { useSelector, useDispatch } from 'react-redux';
import {type RootState } from '../store/store';
import { setFilters } from '../store/filterSlice';

export const LanguagesListPage = () => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- REDUX ---
  const dispatch = useDispatch();
  // Читаем АКТИВНЫЕ фильтры из глобального стора, а не из локального стейта
  const activeFilters = useSelector((state: RootState) => state.filters);

  // Локальные состояния для инпутов (чтобы пользователь мог печатать, не отправляя запрос сразу)
  // Инициализируем их значениями из Redux!
  const [localName, setLocalName] = useState(activeFilters.name || '');
  const [localFamily, setLocalFamily] = useState(activeFilters.family || '');
  const [localWriting, setLocalWriting] = useState(activeFilters.writingFamily || '');

  // 1. Загрузка данных
  // Этот эффект сработает при первой загрузке И при изменении activeFilters в Redux
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      // Запрашиваем данные с фильтрами из Redux
      const data = await getLanguages(activeFilters, mockLanguages);
      setLanguages(data);
      setIsLoading(false);
    };

    fetchLanguages();
  }, [activeFilters]); // Зависимость от Redux-состояния

  // 2. Обработчик кнопки "Применить"
  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Отправляем (диспатчим) новые значения в глобальный Redux-стор
    dispatch(setFilters({
      name: localName,
      family: localFamily,
      writingFamily: localWriting,
    }));
  };

  if (isLoading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="mb-4 p-3 border rounded">
        <h5>Фильтры (Redux)</h5>
        <Form onSubmit={handleFilterSubmit}>
          <Row>
            {/* Поле Название */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            {/* Остальные поля аналогично... */}
            <Col md={3}>
               <Form.Group className="mb-3">
                <Form.Label>Семья</Form.Label>
                <Form.Control
                  type="text"
                  value={localFamily}
                  onChange={(e) => setLocalFamily(e.target.value)}
                />
              </Form.Group>
            </Col>

             <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Письменность</Form.Label>
                <Form.Select 
                  value={localWriting}
                  onChange={(e) => setLocalWriting(e.target.value)}
                >
                  <option value="">Любая</option>
                  <option value="Кириллица">Кириллица</option>
                  <option value="Латиница">Латиница</option>
                  <option value="Арабская">Арабская</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3} className="d-flex align-items-center mb-3">
              <Button variant="primary" type="submit" className="w-100">
                Применить
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {languages.map(lang => (
          <Col key={lang.ID}>
            <LanguageCard language={lang} />
          </Col>
        ))}
      </Row>
    </>
  );
};
