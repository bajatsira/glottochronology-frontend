import { useState, useEffect, type FormEvent } from 'react';
import { Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { LanguageCard } from '../components/LanguageCard';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { setLanguageFilters, fetchLanguages } from '../store/languagesSlice';
import { addLangToDraft } from '../store/langCalculationsSlice';

export const LanguagesListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: languages, status, error, filters } = useSelector((state: RootState) => state.languages);
  const { user } = useSelector((state: RootState) => state.auth);

  const [localName, setLocalName] = useState(filters.name || '');
  const [localFamily, setLocalFamily] = useState(filters.family || '');
  const [localWriting, setLocalWriting] = useState(filters.writingFamily || '');

  useEffect(() => {
    dispatch(fetchLanguages(filters));
  }, [dispatch, filters]);

  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(setLanguageFilters({
      name: localName,
      family: localFamily,
      writingFamily: localWriting,
    }));
  };

  const handleAddToDraft = (langId: number) => {
    dispatch(addLangToDraft({ draftId: 0, langId }));
  };

  if (status === 'loading' && languages.length === 0) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (status === 'failed') {
      return <Alert variant="danger">Ошибка: {error}</Alert>;
  }

  return (
    <>
      <div className="mb-4 p-3 border rounded bg-light">
        <h5>Поиск языков</h5>
        <Form onSubmit={handleFilterSubmit}>
          <Row>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Например, Лезгинский"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Семья</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Например, Нахско-дагестанская"
                  value={localFamily}
                  onChange={(e) => setLocalFamily(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
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
            <Col xs={12} md={3} className="d-flex align-items-center mb-3">
              <Button variant="primary" type="submit" className="w-100 mt-4">
                Применить
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {languages.length === 0 && status === 'succeeded' && (
          <Alert variant="info">Языки не найдены. Попробуйте изменить фильтры.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {languages.map(lang => (
          // ИЗМЕНЕНИЕ №1
          <Col key={lang.id}> 
            <LanguageCard language={lang} />
            {user && (
              <Button 
                  variant="success" 
                  className="mt-2 w-100"
                  // ИЗМЕНЕНИЕ №2
                  onClick={() => handleAddToDraft(lang.id)} 
              >
                  Добавить в заявку
              </Button>
            )}
          </Col>
        ))}
      </Row>
    </>
  );
};
