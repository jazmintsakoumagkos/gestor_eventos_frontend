import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventosService } from '../services/eventosService';
import type { Evento, EventoFormValues } from '../types/Evento';
import EventoForm from '../components/EventoForm';

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<Evento | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<Evento | null>(null);
  const [registering, setRegistering] = useState<Evento | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = availableOnly ? await eventosService.listarDisponibles() : await eventosService.listar();
      setEventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  }, [availableOnly]);

  useEffect(() => { setAvailableOnly(new URLSearchParams(location.search).get('disponibles') === 'true'); }, [location.search]);
  useEffect(() => { void loadEvents(); }, [loadEvents]);

  const filteredEvents = useMemo(() => eventos.filter((evento) =>
    `${evento.nombre} ${evento.lugar || ''} ${evento.descripcion || ''}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))
  ), [eventos, search]);

  async function saveEvent(values: EventoFormValues) {
    setBusy(true); setError(''); setNotice('');
    try {
      if (editing) await eventosService.actualizar(editing._id, values);
      else await eventosService.crear(values);
      setShowForm(false); setEditing(null);
      setNotice(editing ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.');
      await loadEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el evento.';
      setError(message);
      throw err;
    } finally { setBusy(false); }
  }

  async function deleteEvent() {
    if (!deleting) return;
    setBusy(true); setError('');
    try {
      await eventosService.eliminar(deleting._id);
      setDeleting(null); setNotice('Evento eliminado correctamente.');
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el evento.');
      setDeleting(null);
    } finally { setBusy(false); }
  }

  async function registerParticipant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registering) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await eventosService.registrarParticipante(registering._id, { nombre: participantName.trim(), email: participantEmail.trim() });
      setRegistering(null); setParticipantName(''); setParticipantEmail('');
      setNotice('Participante registrado. Los cupos se actualizaron.');
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar al participante.');
    } finally { setBusy(false); }
  }

  return (
    <main className="container page-wrap">
      <div className="page-heading">
        <div><span className="eyebrow">PANEL DE ADMINISTRACIÓN</span><h1>Eventos</h1><p>Creá, editá y administrá los eventos guardados en tu API.</p></div>
        <Button variant="success" size="lg" onClick={() => { setEditing(null); setShowForm(true); }}>＋ Nuevo evento</Button>
      </div>
      {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      <Card className="filter-card mb-4"><Card.Body><Row className="align-items-end g-3">
        <Col md={7}><Form.Label>Buscar evento</Form.Label><Form.Control value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, lugar o descripción…" /></Col>
        <Col md={3}><Form.Check type="switch" id="available-only" label="Solo con cupos" checked={availableOnly} onChange={(e) => navigate(e.target.checked ? '/eventos?disponibles=true' : '/eventos')} /></Col>
        <Col md={2}><Button variant="outline-secondary" className="w-100" onClick={() => void loadEvents()}>Actualizar</Button></Col>
      </Row></Card.Body></Card>

      {loading ? <div className="state-panel"><Spinner animation="border" role="status" /><p>Cargando eventos desde la API…</p></div>
        : filteredEvents.length === 0 ? <div className="state-panel"><div className="empty-icon">○</div><h2>No hay eventos para mostrar</h2><p>Probá cambiar la búsqueda o creá un evento nuevo.</p><Button variant="success" onClick={() => { setEditing(null); setShowForm(true); }}>Crear primer evento</Button></div>
        : <Row className="g-3">{filteredEvents.map((evento) => {
          const seats = evento.entradasDisponibles;
          const full = typeof seats === 'number' && seats <= 0;
          return <Col key={evento._id} md={6} xl={4}><Card className="event-card h-100"><Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start gap-2 mb-3"><span className="event-date">{formatDate(evento.fecha)}</span><Badge bg={full ? 'secondary' : 'success'}>{typeof seats === 'number' ? full ? 'Completo' : `${seats} cupos` : 'Cupos s/d'}</Badge></div>
            <Card.Title>{evento.nombre}</Card.Title>
            <p className="event-place">⌖ {evento.lugar || 'Lugar a confirmar'}</p>
            <Card.Text className="event-description">{evento.descripcion || 'Este evento todavía no tiene descripción.'}</Card.Text>
            <div className="event-meta mt-auto"><span>{evento.participantes?.length || 0} inscriptos</span>{typeof evento.capacidadMaxima === 'number' && <span>Capacidad: {evento.capacidadMaxima}</span>}</div>
            <div className="event-actions">
              <Button size="sm" variant="outline-success" onClick={() => { setEditing(evento); setShowForm(true); }}>Editar</Button>
              <Button size="sm" variant="outline-secondary" disabled={full} onClick={() => setRegistering(evento)}>Inscribir</Button>
              <Button size="sm" variant="outline-danger" onClick={() => setDeleting(evento)}>Eliminar</Button>
            </div>
          </Card.Body></Card></Col>;
        })}</Row>}

      <Modal show={showForm} onHide={() => { setShowForm(false); setEditing(null); }} centered>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Editar evento' : 'Crear evento'}</Modal.Title></Modal.Header>
        <Modal.Body><EventoForm key={editing?._id || 'new'} evento={editing} onSave={saveEvent} onCancel={() => { setShowForm(false); setEditing(null); }} /></Modal.Body>
      </Modal>
      <Modal show={!!deleting} onHide={() => setDeleting(null)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar eliminación</Modal.Title></Modal.Header>
        <Modal.Body>¿Seguro que querés eliminar <strong>{deleting?.nombre}</strong>? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="danger" disabled={busy} onClick={() => void deleteEvent()}>{busy ? 'Eliminando…' : 'Sí, eliminar'}</Button></Modal.Footer>
      </Modal>
      <Modal show={!!registering} onHide={() => setRegistering(null)} centered>
        <Modal.Header closeButton><Modal.Title>Inscribir participante</Modal.Title></Modal.Header>
        <Form onSubmit={registerParticipant}><Modal.Body>
          <p className="text-muted small">Evento: {registering?.nombre}. Esta acción consume un cupo disponible.</p>
          <Form.Group className="mb-3"><Form.Label>Nombre completo *</Form.Label><Form.Control required value={participantName} onChange={(e) => setParticipantName(e.target.value)} /></Form.Group>
          <Form.Group><Form.Label>Email *</Form.Label><Form.Control required type="email" value={participantEmail} onChange={(e) => setParticipantEmail(e.target.value)} /></Form.Group>
        </Modal.Body><Modal.Footer><Button variant="outline-secondary" onClick={() => setRegistering(null)}>Cancelar</Button><Button type="submit" variant="success" disabled={busy}>{busy ? 'Inscribiendo…' : 'Confirmar inscripción'}</Button></Modal.Footer></Form>
      </Modal>
    </main>
  );
}