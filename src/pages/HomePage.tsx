import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Используем Link для навигации

export const HomePage = () => {
  return (
    // 1. Создаем обычный div
    // 2. Применяем к нему стандартные классы Bootstrap:
    //    p-5: большой внутренний отступ (padding)
    //    mb-4: большой нижний внешний отступ (margin-bottom)
    //    bg-light: светло-серый фон
    //    rounded-3: скругленные углы
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">Добро пожаловать в проект "Глоттохронология"!</h1>
        <p className="col-md-8 fs-4">
          Это SPA-приложение, разработанное на React и TypeScript, для расчета времени расхождения языков.
          Перейдите на страницу услуг, чтобы начать.
        </p>
        
        {/* 3. Оборачиваем кнопку в Link из react-router-dom для SPA-навигации */}
        <Link to="/languages">
          <Button variant="primary" size="lg">
            Перейти к услугам
          </Button>
        </Link>
      </div>
    </div>
  );
};