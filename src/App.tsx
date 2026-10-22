import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Eventos from './pages/Eventos';

function NotFound() {
  return <Container className="page-wrap"><div className="state-panel"><h1>Página no encontrada</h1><p>La dirección que buscás no existe.</p><Link className="btn btn-success" to="/">Volver al inicio</Link></div></Container>;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="app-shell">
      <Navbar expand="lg" className="site-navbar">
        <Container><Navbar.Brand as={Link} to="/" className="brand"><span className="brand-mark">G.</span><span>gestor<span className="brand-light">eventos</span></span></Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navigation" />
          <Navbar.Collapse id="main-navigation"><Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/eventos" active={location.pathname === '/eventos'}>Eventos</Nav.Link>
            <Nav.Link as={Link} to="/eventos?disponibles=true" active={location.search.includes('disponibles=true')}>Con cupos</Nav.Link>
          </Nav></Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes><Route path="/" element={<Inicio />} /><Route path="/eventos" element={<Eventos />} /><Route path="*" element={<NotFound />} /></Routes>
      <footer className="site-footer"><Container><span>Gestor de Eventos</span><span>Proyecto académico · React + API REST</span></Container></footer>
    </div>
  );
}