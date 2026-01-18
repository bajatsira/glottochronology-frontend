import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
  <Container fluid> 
        <Navbar.Brand as={Link} to="/">Глоттохронология SPA</Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/">Главная</Nav.Link>
          <Nav.Link as={Link} to="/languages">Языки</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};