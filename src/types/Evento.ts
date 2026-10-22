export interface Participante {
  nombre: string;
  email: string;
}

export interface Evento {
  _id: string;
  nombre: string;
  descripcion?: string;
  fecha: string;
  lugar?: string;
  participantes: Participante[];
  capacidadMaxima?: number;
  entradasDisponibles?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventoFormValues {
  nombre: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  capacidadMaxima: number | '';
  entradasDisponibles: number | '';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}