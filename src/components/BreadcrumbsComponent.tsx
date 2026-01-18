// src/components/BreadcrumbsComponent.tsx
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export const BreadcrumbsComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // --- ДОБАВЛЕНО УСЛОВИЕ ---
  // Если мы на главной странице (pathnames пустой),
  // то не рендерим ничего (возвращаем null).
  if (pathnames.length === 0) {
    return null;
  }
  // -------------------------

  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Главная
      </Breadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        // Преобразуем 'languages' в 'Языки' для красоты
        const displayName = name === 'languages' ? 'Языки' : name;
        
        return isLast ? (
          <Breadcrumb.Item active key={routeTo}>{displayName}</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={routeTo} linkAs={Link} linkProps={{ to: routeTo }}>
            {displayName}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};
