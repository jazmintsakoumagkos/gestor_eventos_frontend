import { Alert, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import type { Evento, EventoFormValues } from '../types/Evento';

interface Props {
  evento?: Evento | null;
  onSave: (values: EventoFormValues) => Promise<void>;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  nombre: Yup.string().trim().min(3, 'Usá al menos 3 caracteres').required('El nombre es obligatorio'),
  fecha: Yup.string().required('La fecha es obligatoria'),
  descripcion: Yup.string(),
  lugar: Yup.string(),
  capacidadMaxima: Yup.number().transform((value, original) => original === '' ? undefined : value).integer('Ingresá un número entero').min(1, 'Debe ser mayor a cero').optional(),
  entradasDisponibles: Yup.number().transform((value, original) => original === '' ? undefined : value).integer('Ingresá un número entero').min(0, 'No puede ser negativa').optional(),
});

const emptyValues: EventoFormValues = {
  nombre: '', descripcion: '', fecha: '', lugar: '', capacidadMaxima: '', entradasDisponibles: '',
};

function toDateInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toISOString().slice(0, 10);
}

export default function EventoForm({ evento, onSave, onCancel }: Props) {
  const initialValues: EventoFormValues = evento ? {
    nombre: evento.nombre,
    descripcion: evento.descripcion || '',
    fecha: toDateInput(evento.fecha),
    lugar: evento.lugar || '',
    capacidadMaxima: evento.capacidadMaxima ?? '',
    entradasDisponibles: evento.entradasDisponibles ?? '',
  } : emptyValues;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        try {
          await onSave(values);
          helpers.resetForm();
        } catch {
          // El mensaje de error se muestra en la página que contiene el formulario.
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, status }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {status && <Alert variant="danger">{status}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del evento *</Form.Label>
            <Form.Control name="nombre" value={values.nombre} onChange={handleChange} onBlur={handleBlur} isInvalid={!!(touched.nombre && errors.nombre)} placeholder="Ej. Taller de React" />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha *</Form.Label>
            <Form.Control type="date" name="fecha" value={values.fecha} onChange={handleChange} onBlur={handleBlur} isInvalid={!!(touched.fecha && errors.fecha)} />
            <Form.Control.Feedback type="invalid">{errors.fecha}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control name="lugar" value={values.lugar} onChange={handleChange} placeholder="Aula, sala o dirección" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="descripcion" value={values.descripcion} onChange={handleChange} placeholder="¿De qué se trata el evento?" />
          </Form.Group>
          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label>Capacidad máxima</Form.Label>
              <Form.Control type="number" min="1" name="capacidadMaxima" value={values.capacidadMaxima} onChange={(e) => {
                handleChange(e);
                if (values.entradasDisponibles === '') setFieldValue('entradasDisponibles', e.target.value);
              }} isInvalid={!!(touched.capacidadMaxima && errors.capacidadMaxima)} />
              <Form.Control.Feedback type="invalid">{errors.capacidadMaxima as string}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6 mb-3">
              <Form.Label>Entradas disponibles</Form.Label>
              <Form.Control type="number" min="0" name="entradasDisponibles" value={values.entradasDisponibles} onChange={handleChange} isInvalid={!!(touched.entradasDisponibles && errors.entradasDisponibles)} />
              <Form.Control.Feedback type="invalid">{errors.entradasDisponibles as string}</Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="outline-secondary" type="button" onClick={onCancel}>Cancelar</Button>
            <Button variant="success" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : evento ? 'Guardar cambios' : 'Crear evento'}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}