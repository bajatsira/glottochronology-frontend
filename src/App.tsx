// src/App.tsx
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NavbarComponent } from './components/NavbarComponent';
import { BreadcrumbsComponent } from './components/BreadcrumbsComponent';

function App() {
  return (
    <>
      {}
      {}
      <NavbarComponent />

      {}
      <Container className="mt-4">
        <BreadcrumbsComponent />
        <hr />
        {/* Outlet — место, где будут рисоваться наши страницы */}
        <Outlet />
      </Container>
    </>
  );
}

export default App;
