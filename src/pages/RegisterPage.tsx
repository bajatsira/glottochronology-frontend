import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Loader2 } from 'lucide-react'; // Используем иконку загрузки из lucide
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  // Локальное состояние успеха, чтобы переключить UI
  const [isSuccess, setIsSuccess] = useState(false); 

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser({ login, password }));
    
    if (registerUser.fulfilled.match(resultAction)) {
      setIsSuccess(true);
      // Мы НЕ делаем navigate('/login') сразу, а даем пользователю прочитать сообщение
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.successMessage}>
            <h2 className={styles.successTitle}>Регистрация успешна</h2>
            <p className="text-muted-foreground mb-4">
              Ваш аккаунт создан. Теперь вы можете войти в систему, чтобы начать работу.
            </p>
            <Link to="/login" className={styles.loginLink}>
              → Войти в аккаунт
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>РЕГИСТРАЦИЯ</h2>

        {error && (
          <div className={styles.errorAlert}>
            {/* Если ошибка приходит объектом, пробуем отобразить message, иначе JSON */}
            {typeof error === 'string' ? error : JSON.stringify(error)}
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
              required
              placeholder="username"
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
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Обработка...
              </span>
            ) : (
              'Создать аккаунт'
            )}
          </button>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Уже есть аккаунт? </span>
            <Link to="/auth" className="font-bold hover:underline decoration-accent underline-offset-4">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
