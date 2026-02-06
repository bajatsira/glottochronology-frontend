// src/App.tsx
import { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom'; // Убедитесь, что Link импортирован
import { Container, Badge, Button, Spinner } from 'react-bootstrap';
import { NavbarComponent } from './components/NavbarComponent';
import { BreadcrumbsComponent } from './components/BreadcrumbsComponent';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { fetchLangCalculations } from './store/langCalculationsSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const { user } = useSelector((state: RootState) => state.auth);
  const { draft, status } = useSelector((state: RootState) => state.langCalculations);

  useEffect(() => {
    if (user) {
      dispatch(fetchLangCalculations());
    }
  }, [user, dispatch]);

  const cartCount = draft?.languages?.length || 0;
  const isCartLoading = status === 'loading';
  
  // Определяем, активна ли ссылка. Она неактивна, если черновика нет.
  const isCartDisabled = !draft;

  return (
    <>
      <NavbarComponent />

      <Container className="mt-4">
        
        {!isHomePage && user && (
          <div className="d-flex justify-content-end mb-3">
            {}

            {/* 1. Оборачиваем кнопку в Link */}
            <Link
              to={draft ? `/LangCalculation/${draft.id}` : '#'}
              // 2. Добавляем стиль, чтобы убрать синее подчеркивание у ссылки
              style={{ textDecoration: 'none' }}
              // 3. Добавляем CSS-класс, чтобы сделать ссылку некликабельной, если она должна быть disabled
              className={isCartDisabled ? 'disabled-link' : ''}
              // Для доступности
              aria-disabled={isCartDisabled}
              tabIndex={isCartDisabled ? -1 : undefined}
            >
              {/* 4. Из Button убираем 'as' и 'to' */}
              <Button
                variant={draft ? "dark" : "outline-dark"}
                disabled={isCartDisabled && !isCartLoading} // Кнопка визуально серая, если нужно
                style={{ borderRadius: 0, minWidth: '120px' }}
              >
                {isCartLoading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <>
                    <span className="me-2">🛒</span>
                    Черновик <Badge bg="secondary">{cartCount}</Badge>
                  </>
                )}
              </Button>
            </Link>

            {/* ------------------------- */}
          </div>
        )}

        <BreadcrumbsComponent />
        <hr className={isHomePage ? "d-none" : ""} />
        
        <Outlet />
      </Container>
    </>
  );
}

export default App;

