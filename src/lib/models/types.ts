import { DiaSemana, EstadoActividad, Moneda } from "./enums";

export interface Horario {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface Contacto {
  telefono: string | null;
  whatsapp: string | null;
  email: string | null;
  direccion: string | null;
  sitioWeb: string | null;
  instagram: string | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  color: string | null;
}

export interface RangoEdad {
  id: string;
  etiqueta: string;
  edadMin: number;
  edadMax: number;
}

export interface Zona {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  rangoEdadId: string;
  zonaId: string;
  esGratuita: boolean;
  precioDesde: number | null;
  precioHasta: number | null;
  moneda: Moneda | null;
  estado: EstadoActividad;
  imagenUrl: string | null;
  horarios: Horario[];
  contacto: Contacto;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Favorita {
  actividadId: string;
  agregadoEn: string;
}

export interface Entidad {
  id: string;
}
