// src/pages/LangListPage.tsx
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import { mockLanguages } from '../data/mockLanguages'; // Импортируем наши "ненастоящие" данные

export const LanguagesListPage = () => {
  return (
    <>
      {/* --- Блок с фильтрами, как в ТЗ --- */}
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
            <Col md={4}>
              {/* Другие фильтры, например, по дате или цене (если бы они были) */}
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" type="submit">Применить</Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* --- Сетка с карточками услуг --- */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {/* Используем .map() для отрисовки карточки для каждого элемента из mock-данных */}
        {mockLanguages.map(lang => (
          <Col key={lang.id}>
            <LanguageCard language={lang} />
          </Col>
        ))}
      </Row>
    </>
  );
};
