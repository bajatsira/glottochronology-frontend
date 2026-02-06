import { useEffect } from 'react';
import { Table, Badge, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLangCalculations, deleteCalculation } from '../store/langCalculationsSlice';
import type { RootState, AppDispatch } from '../store/store';

export const LangCalculationListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Берем данные из слайса langCalculations
  const { items, status, error } = useSelector((state: RootState) => state.langCalculations);

  useEffect(() => {
    dispatch(fetchLangCalculations());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот расчет?')) {
      dispatch(deleteCalculation(id));
    }
  };

  if (status === 'loading') {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Ошибка загрузки данных: {typeof error === 'object' ? JSON.stringify(error) : error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">История расчетов (Глоттохронология)</h2>
      
      {items.length === 0 ? (
        <Alert variant="info">
          У вас пока нет заявок на расчет. Перейдите в <Link to="/languages">каталог языков</Link>, чтобы создать новую заявку.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата создания</th>
              <th>Статус</th>
              <th>Базовый язык (ID)</th>
              <th>Кол-во языков</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map(calc => (
              <tr key={calc.id}>
                <td>{calc.id}</td>
                <td>
                  {calc.dateCreate 
                    ? new Date(calc.dateCreate).toLocaleDateString() + ' ' + new Date(calc.dateCreate).toLocaleTimeString() 
                    : '-'}
                </td>
                <td>
                  <Badge bg={
                    calc.status === 'черновик' ? 'secondary' :
                    calc.status === 'сформирован' ? 'primary' :
                    calc.status === 'завершён' ? 'success' : 'danger'
                  }>
                    {calc.status}
                  </Badge>
                </td>
                <td>
                    {calc.baseLanguageID ? calc.baseLanguageID : <span className="text-muted">Не назначен</span>}
                </td>
                <td>{calc.languages?.length || 0}</td>
                <td>
                  {/* Ссылка "по теме": /LangCalculation/:id */}
                  <Link to={`/LangCalculation/${calc.id}`}>
                    <Button variant="info" size="sm" className="me-2 text-white">
                      Подробнее
                    </Button>
                  </Link>
                  
                  {calc.status === 'черновик' && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(calc.id!)}
                    >
                      Удалить
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
