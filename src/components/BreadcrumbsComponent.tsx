import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export const BreadcrumbsComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);


  if (pathnames.length === 0) {
    return null;
  }


  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Главная
      </Breadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
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
