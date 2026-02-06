import { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import axios from 'axios'; // Импортируем axios напрямую для теста

export const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  // 1. Проверяем, не завис ли статус в loading при загрузке страницы
  useEffect(() => {
    console.log("LoginPage mounted. Current Redux Auth Status:", status);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    // 2. Первым делом проверяем, сработал ли вообще клик
    console.log(">>> 1. Событие Submit перехвачено");
    e.preventDefault();

    console.log(">>> 2. Данные формы:", { login, password });

    if (!login || !password) {
      console.error(">>> ОШИБКА: Поля пустые (хотя required должен был сработать)");
      return;
    }

    try {
      console.log(">>> 3. Попытка вызвать dispatch(loginUser)...");
      
      // Вызываем экшен
      const resultAction = await dispatch(loginUser({ login, password }));
      
      console.log(">>> 4. Результат dispatch:", resultAction);

      if (loginUser.fulfilled.match(resultAction)) {
        console.log(">>> 5. Успех! Переход на главную...");
        navigate('/');
      } else {
        console.error(">>> 5. Ошибка в Redux Action:", resultAction.payload);
      }
    } catch (err) {
      console.error(">>> КРИТИЧЕСКАЯ ОШИБКА ВНУТРИ COMPONENT:", err);
    }
  };

  // Тестовая функция для проверки сети в обход Redux
  const handleDirectTest = async () => {
    console.log(">>> TEST: Пробуем прямой запрос через axios (без Redux)...");
    try {
        const response = await axios.post('/api/auth/login', { login, password });
        console.log(">>> TEST: Прямой запрос прошел успешно!", response.data);
        alert("Прямой запрос прошел! Проблема в Redux или thunk.");
    } catch (e: any) {
        console.error(">>> TEST: Ошибка прямого запроса:", e);
        alert(`Ошибка прямого запроса: ${e.message}`);
    }
  }

  return (
    <Container style={{ maxWidth: '400px' }} className="mt-5">
      <h2 className="text-center mb-4">Вход (Debug Mode)</h2>
      
      {/* Отображаем текущий статус явно */}
      <Alert variant="info">Redux Status: {status}</Alert>

      {error && <Alert variant="danger">Error: {JSON.stringify(error)}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Логин</Form.Label>
          <Form.Control 
            type="text" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
            // Убираем required временно, чтобы исключить блокировку браузером
            // required 
            placeholder="Введите логин"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            // required 
             placeholder="Введите пароль"
          />
        </Form.Group>
        
        {/* Основная кнопка */}
        <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3" 
            // Если статус loading, кнопка будет отключена - проверим это
            disabled={status === 'loading'}
        >
          {status === 'loading' ? <Spinner size="sm" animation="border" /> : 'Войти (Submit)'}
        </Button>

        {/* Запасная кнопка для теста */}
        <Button variant="secondary" type="button" className="w-100" onClick={handleDirectTest}>
            Тест сети (без Redux)
        </Button>
      </Form>
    </Container>
  );
};
