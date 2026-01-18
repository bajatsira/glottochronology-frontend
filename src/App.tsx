// src/App.tsx
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NavbarComponent } from './components/NavbarComponent';
import { BreadcrumbsComponent } from './components/BreadcrumbsComponent';

function App() {
  return (
    // Используем React-фрагмент (<>...</>) или простой <div>, чтобы обернуть все.
    <>
      {/* 1. Navbar рендерится первым и сам по себе. */}
      {/* Он будет прижат к верху и (если использовать <Container fluid>) растянут по ширине. */}
      <NavbarComponent />

      {/* 2. А вот уже весь ОСТАЛЬНОЙ контент мы оборачиваем в контейнер с отступами. */}
      <Container className="mt-4">
        <BreadcrumbsComponent />
        <hr />
        {/* Outlet — это место, где будут рисоваться наши страницы */}
        <Outlet />
      </Container>
    </>
  );
}

export default App;
