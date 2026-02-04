import { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice'; // Предполагаем, что этот thunk есть
import type { AppDispatch, RootState } from '../store/store';

export const RegisterPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ login, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      alert("Регистрация успешна! Теперь войдите.");
      navigate('/login');
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }} className="mt-5">
      <h2 className="text-center mb-4">Регистрация</h2>
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="text" value={login} onChange={e => setLogin(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="success" type="submit" className="w-100" disabled={status === 'loading'}>
          {status === 'loading' ? <Spinner size="sm" animation="border" /> : 'Зарегистрироваться'}
        </Button>
      </Form>
    </Container>
  );
};
