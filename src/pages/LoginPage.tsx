import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Loader2 } from 'lucide-react';
import styles from './RegisterPage.module.css';

export const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>(); // Типизируем dispatch
  const navigate = useNavigate();
  
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) return;
    
    const resultAction = await dispatch(loginUser({ login, password }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>ВХОД</h2>

        {error && (
          <div className={styles.errorAlert}>
            Ошибка: {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="login">
              Логин
            </label>
            <input
              id="login"
              type="text"
              className={styles.input}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Вход...
              </span>
            ) : (
              'Войти'
            )}
          </button>

          <div className={styles.registerLink}>
            Нет аккаунта?{' '}
            <Link to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
