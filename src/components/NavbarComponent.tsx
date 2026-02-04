import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';

export const NavbarComponent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar bg="white" sticky="top" expand="lg" className="border-bottom py-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 900, fontSize: '1.5rem', color: '#000' }}>
          N<span style={{ color: '#f26e40' }}>+</span>1 GLOTTO
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: '#000' }}>Главная</Nav.Link>
            <Nav.Link as={Link} to="/languages" style={{ color: '#000' }}>Рубрики (Услуги)</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/requests" style={{ color: '#000' }}>Мои Заявки</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">{user.login}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Выход</Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login"><Button variant="outline-dark" size="sm">Вход</Button></Link>
                <Link to="/register"><Button variant="dark" size="sm">Регистрация</Button></Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
