// src/App.tsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Добавили useLocation
import { Container, Badge, Button, Spinner } from 'react-bootstrap';
import { NavbarComponent } from './components/NavbarComponent';
import { BreadcrumbsComponent } from './components/BreadcrumbsComponent';
import { getCartStatus } from './api/languagesApi';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);
  
  // Получаем текущий путь
  const location = useLocation();
  // Проверяем, главная ли это страница
  const isHomePage = location.pathname === '/';

  const refreshCart = async () => {
    setIsCartLoading(true);
    try {
      const data = await getCartStatus();
      setCartCount(data.count);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <>
      <NavbarComponent />

      <Container className="mt-4">
        
        {/* --- УСЛОВИЕ: Показываем корзину ТОЛЬКО если это НЕ главная страница --- */}
        {!isHomePage && (
          <div className="d-flex justify-content-end mb-3">
            <Button 
              variant="outline-dark" // Стиль под N+1
              onClick={refreshCart}
              disabled={isCartLoading}
              title="Обновить статус"
              style={{ borderRadius: 0 }} // Квадратная кнопка как в N+1
            >
              {isCartLoading ? (
                <Spinner as="span" animation="border" size="sm" className="me-2" />
              ) : (
                <span className="me-2">Корзина</span>
              )}
              <Badge bg="dark">{cartCount}</Badge>
            </Button>
          </div>
        )}
        {/* ----------------------------------------------------------------------- */}

        <BreadcrumbsComponent />
        <hr className={isHomePage ? "d-none" : ""} /> {/* Скрываем линию на главной */}
        
        <Outlet />
      </Container>
    </>
  );
}

export default App;
