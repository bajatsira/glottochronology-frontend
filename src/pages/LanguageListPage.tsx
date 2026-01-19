import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import type { ILanguage } from '../data/mockLanguages';
import { getLanguages } from '../api/languagesApi';
import { mockLanguages } from '../data/mockLanguages';

export const LanguagesListPage = () => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      // Пытаемся получить реальные данные, если не получится - используем моки
      const data = await getLanguages(mockLanguages);
      
      setLanguages(data);
      setIsLoading(false);
    };

    fetchLanguages();
  }, []); // Пустой массив зависимостей, чтобы запрос выполнился один раз

  // --- Логика отображения ---

  // 1. Показываем спиннер, пока идет загрузка
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </div>
    );
  }

  // 2. Когда загрузка завершена, показываем контент
  return (
    <>
      {/* --- Блок с фильтрами --- */}
      <div className="mb-4 p-3 border rounded">
        <h5>Фильтры</h5>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Название</Form.Label>
                <Form.Control type="text" placeholder="Введите название..." />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" type="submit">Применить</Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* --- Сетка с карточками языков --- */}
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
