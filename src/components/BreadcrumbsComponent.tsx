import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export const BreadcrumbsComponent = () => {
  const location = useLocation();
  // Разбиваем путь на части и убираем пустые строки
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  // Словарь для перевода путей
  const routeNameMap: Record<string, string> = {
    languages: 'Языки',
    login: 'Вход',
    register: 'Регистрация',
    requests: 'Расчеты',
    LangCalculation: 'Дивергенция языков', 
   'lang-calculation': 'Дивергенция языков',
    LangCalculations: 'Дивергенция языков'
  };

  return (
    <Breadcrumb className="mt-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Главная
      </Breadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // 1. Сначала ищем точное совпадение в словаре
        let displayName = routeNameMap[name];

        // 2. Если не нашли, проверяем, не число ли это (ID)
        if (!displayName) {
             if (!isNaN(Number(name))) {
                 displayName = name; 
             } else {
                 displayName = name;
             }
        }
        
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
