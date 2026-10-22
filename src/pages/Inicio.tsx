import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';

export default function Inicio() {
  return (
    <main className="container page-wrap">
      <section className="hero-panel">
        <span className="eyebrow">PILAR TECNO · PROYECTO FINAL</span>
        <h1>Los eventos, <em>en un solo lugar.</em></h1>
        <p>Organizá encuentros, administrá sus datos y gestioná las inscripciones desde una interfaz conectada a tu propia API.</p>
        <div className="d-flex flex-wrap gap-3">
          <Button as={Link} to="/eventos" variant="success" size="lg">Administrar eventos <span aria-hidden="true">↗</span></Button>
          <Button as={Link} to="/eventos?disponibles=true" variant="outline-light" size="lg">Ver eventos con cupos</Button>
        </div>
        <div className="hero-foot"><span className="status-dot" /> API REST · MongoDB · React + TypeScript</div>
      </section>
      <section className="intro-section">
        <div className="section-heading"><span className="eyebrow">QUÉ PODÉS HACER</span><h2>Una gestión simple y clara.</h2></div>
        <Row className="g-3">
          <Col md={4}><Card className="feature-card h-100"><Card.Body><span className="feature-number">01</span><h3>Organizar</h3><p>Creá eventos con fecha, lugar, descripción y capacidad.</p></Card.Body></Card></Col>
          <Col md={4}><Card className="feature-card h-100"><Card.Body><span className="feature-number">02</span><h3>Administrar</h3><p>Consultá y editá los datos existentes sin recargar la página.</p></Card.Body></Card></Col>
          <Col md={4}><Card className="feature-card h-100"><Card.Body><span className="feature-number">03</span><h3>Inscribir</h3><p>Registrá participantes y actualizá los cupos disponibles.</p></Card.Body></Card></Col>
        </Row>
      </section>
    </main>
  );
}