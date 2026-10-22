import axios from 'axios';
import type { ApiResponse, Evento, EventoFormValues, Participante } from '../types/Evento';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { msg: string }[] } | undefined;
    if (data?.errors?.length) return data.errors.map((item) => item.msg).join('. ');
    return data?.message || error.message || 'No se pudo conectar con la API.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

async function request<T>(operation: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const response = await operation();
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const eventosService = {
  async listar(): Promise<Evento[]> {
    const data = await request<{ eventos: Evento[]; paginacion: unknown }>(() => api.get('/eventos'));
    return data.eventos;
  },
  async listarDisponibles(): Promise<Evento[]> {
    return request<Evento[]>(() => api.get('/eventos/disponibles'));
  },
  async crear(values: EventoFormValues): Promise<Evento> {
    const payload = normalizeValues(values);
    return request<Evento>(() => api.post('/eventos', payload));
  },
  async actualizar(id: string, values: EventoFormValues): Promise<Evento> {
    return request<Evento>(() => api.put(`/eventos/${id}`, normalizeValues(values)));
  },
  async eliminar(id: string): Promise<void> {
    await request<unknown>(() => api.delete(`/eventos/${id}`));
  },
  async registrarParticipante(id: string, participante: Participante): Promise<Evento> {
    return request<Evento>(() => api.post(`/eventos/${id}/registrar`, participante));
  },
};

function normalizeValues(values: EventoFormValues) {
  return {
    nombre: values.nombre.trim(),
    descripcion: values.descripcion.trim(),
    fecha: values.fecha,
    lugar: values.lugar.trim(),
    ...(values.capacidadMaxima !== '' ? { capacidadMaxima: Number(values.capacidadMaxima) } : {}),
    ...(values.entradasDisponibles !== '' ? { entradasDisponibles: Number(values.entradasDisponibles) } : {}),
  };
}