import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchLangCalculationById, 
  removeLangFromDraft, 
  confirmCalculation, 
  clearCurrentDetail 
} from '../store/langCalculationsSlice';
import type { RootState, AppDispatch } from '../store/store';

export const LangCalculationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentDetail, status, error } = useSelector((state: RootState) => state.langCalculations);

  useEffect(() => {
    if (id) {
      dispatch(fetchLangCalculationById(Number(id)));
    }
    // Очистка при размонтировании компонента
    return () => {
        dispatch(clearCurrentDetail());
    };
  }, [id, dispatch]);

  const handleRemoveLang = (langId: number) => {
    if (currentDetail?.id) {
        if (confirm('Удалить этот язык из расчета?')) {
            dispatch(removeLangFromDraft({ draftId: currentDetail.id, langId }));
        }
    }
  };

  const handleConfirm = async () => {
    if (currentDetail?.id) {
       if (confirm('Вы уверены, что хотите отправить заявку на расчет? Редактирование станет недоступным.')) {
           await dispatch(confirmCalculation(currentDetail.id));
           navigate('/lang-calculations'); // Возврат к списку
       }
    }
  };

  if (status === 'loading') {
      return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  }
  
  if (error) {
      return <Container className="mt-5"><Alert variant="danger">{typeof error === 'object' ? JSON.stringify(error) : error}</Alert></Container>;
  }
  
  if (!currentDetail) {
      return <Container className="mt-5"><Alert variant="warning">Заявка не найдена</Alert></Container>;
  }

  const isDraft = currentDetail.status === 'черновик';
  const isCompleted = currentDetail.status === 'завершён';

  return (
    <Container className="mt-4">
      {/* Хедер с навигацией назад */}
      <div className="mb-3">
          <Link to="/lang-calculations" className="text-decoration-none">&larr; Вернуться к списку</Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
            Расчет #{currentDetail.id} <Badge bg={isDraft ? "secondary" : isCompleted ? "success" : "primary"}>{currentDetail.status}</Badge>
        </h2>
        {isDraft && (
            <Button 
                variant="success" 
                onClick={handleConfirm} 
                disabled={!currentDetail.languages || currentDetail.languages.length < 2}
                title={(!currentDetail.languages || currentDetail.languages.length < 2) ? "Для расчета нужно минимум 2 языка" : ""}
            >
                Сформировать заявку
            </Button>
        )}
      </div>

      {/* Блок результатов (только для завершенных) */}
      {isCompleted && (
          <Card className="mb-4 border-success">
              <Card.Header className="bg-success text-white">Результаты Глоттохронологии</Card.Header>
              <Card.Body>
                  <Row className="text-center">
                      <Col>
                          <h4>{currentDetail.similarityRate ? (currentDetail.similarityRate * 100).toFixed(2) : 0}%</h4>
                          <span className="text-muted">Коэффициент схожести</span>
                      </Col>
                      <Col>
                          <h4>{currentDetail.resultYearsAgo} лет</h4>
                          <span className="text-muted">Время расхождения</span>
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
      )}

      <h4>Выбранные языки</h4>
      <Table bordered hover>
        <thead className="table-light">
          <tr>
            <th>Название</th>
            <th>Семья</th>
            <th>Роль</th>
            {isDraft && <th style={{ width: '150px' }}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {currentDetail.languages?.map(item => (
            <tr key={item.id}> 
              <td>
                  <Link to={`/languages/${item.language?.id}`} className="fw-bold text-decoration-none">
                      {item.language?.name}
                  </Link>
              </td>
              <td>{item.language?.family}</td>
              <td>
                  {item.isBase ? (
                      <Badge bg="info" text="dark">Базовый язык</Badge>
                  ) : (
                      <span className="text-muted">Сравниваемый</span>
                  )}
              </td>
              {isDraft && (
                <td>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="w-100"
                    onClick={() => handleRemoveLang(item.language?.id!)} 
                  >
                    &times; Удалить
                  </Button>
                </td>
              )}
            </tr>
          ))}
          
          {(!currentDetail.languages || currentDetail.languages.length === 0) && (
              <tr>
                  <td colSpan={isDraft ? 4 : 3} className="text-center py-4 text-muted">
                      Список языков пуст. <Link to="/languages">Перейдите в каталог</Link>, чтобы добавить языки.
                  </td>
              </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};
