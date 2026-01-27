// src/pages/LanguagesListPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import type { ILanguage } from '../data/mockLanguages';
import { getLanguages, type IFilterParams } from '../api/languagesApi';
import { mockLanguages } from '../data/mockLanguages';

export const LanguagesListPage = () => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ИЗМЕНЕНИЯ ЗДЕСЬ: Состояния для ВСЕХ фильтров ---
  const [filterName, setFilterName] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterWriting, setFilterWriting] = useState('');
  
  // Хранит "примененные" фильтры
  const [activeFilters, setActiveFilters] = useState<IFilterParams>({});
  // ----------------------------------------------------

  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      const data = await getLanguages(activeFilters, mockLanguages);
      setLanguages(data);
      setIsLoading(false);
    };

    fetchLanguages();
  }, [activeFilters]); 

  // --- ИЗМЕНЕНИЯ ЗДЕСЬ: Собираем все значения в activeFilters ---
  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    setActiveFilters({
      name: filterName,
      family: filterFamily,
      writingFamily: filterWriting,
    });
  };
  // -------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 p-3 border rounded">
        <h5>Фильтры</h5>
        <Form onSubmit={handleFilterSubmit}>
          <Row>
            {/* Поле 1: Название */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* --- ИЗМЕНЕНИЯ ЗДЕСЬ: Новые поля ввода --- */}
            
            {/* Поле 2: Семья (выпадающий список для примера) */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Семья</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Например: Индоевропейская"
                  value={filterFamily}
                  onChange={(e) => setFilterFamily(e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Поле 3: Письменность */}
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Письменность</Form.Label>
                <Form.Select 
                  value={filterWriting}
                  onChange={(e) => setFilterWriting(e.target.value)}
                >
                  <option value="">Любая</option>
                  <option value="Аджама, латиница, кириллица">Аджама, латиница, кириллица</option>
                  <option value="Латиница">Латиница</option>
                  <option value="Арабица">Арабица</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            {/* ------------------------------------------ */}

            <Col md={3} className="d-flex align-items-center mb-3">
              <Button variant="primary" type="submit" className="w-100">
                Применить
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {languages.length > 0 ? (
          languages.map(lang => (
            <Col key={lang.ID}>
              <LanguageCard language={lang} />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <p className="text-center text-muted">Языки по вашему запросу не найдены.</p>
          </Col>
        )}
      </Row>
    </>
  );
};
