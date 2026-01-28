// src/components/NavbarComponent.tsx
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavbarComponent = () => {
  return (
    // bg="white" - белый фон
    // sticky="top" - прилипает к верху при прокрутке
    // className="border-bottom" - тонкая линия снизу, как у N+1
    <Navbar bg="white" sticky="top" expand="lg" className="border-bottom py-3">
      <Container fluid>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          style={{ fontWeight: 900, fontSize: '1.5rem', color: '#000' }}
        >
          {/* Имитация логотипа N+1: Черный текст, акцентная точка */}
          N<span style={{ color: '#f26e40' }}>+</span>1 GLOTTO
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Ссылки теперь черные */}
            <Nav.Link as={Link} to="/" style={{ color: '#000', fontWeight: 500 }}>
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/languages" style={{ color: '#000', fontWeight: 500 }}>
              Рубрики
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
