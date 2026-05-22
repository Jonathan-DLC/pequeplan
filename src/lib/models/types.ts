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
  latitud: number | null;
  longitud: number | null;
  proveedorId: string | null;
  cuposDisponibles: number | null;
  destacada: boolean;
  horarios: Horario[];
  contacto: Contacto;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Proveedor {
  id: string;
  uid: string;
  nombreNegocio: string;
  descripcion: string;
  telefono: string;
  email: string;
  aprobado: boolean;
  verificado: boolean;
  creadoEn: string;
}

export interface Reserva {
  id: string;
  actividadId: string;
  proveedorId: string | null;
  uid: string;
  nombreNino: string;
  edadNino: number;
  nombrePadre: string;
  telefonoPadre: string;
  estado: "PENDIENTE" | "ACEPTADA" | "CONFIRMADA" | "RECHAZADA" | "CANCELADA";
  comision: number;
  precioActividad: number;
  esGratuita: boolean;
  creadoEn: string;
}

export interface Resena {
  id: string;
  actividadId: string;
  uid: string;
  nombreUsuario: string;
  estrellas: number;
  comentario: string;
  respuestaProveedor: string | null;
  creadoEn: string;
}

export interface Reporte {
  id: string;
  tipo: "resena" | "actividad";
  referenciaId: string;
  actividadId: string;
  uid: string;
  nombreReportante: string;
  contactoReportante: string;
  motivo: string;
  descripcion: string;
  estado: "PENDIENTE" | "RESUELTO";
  creadoEn: string;
}

export interface Suscripcion {
  id: string;
  proveedorId: string;
  plan: "BASICO" | "PREMIUM";
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

export interface Favorita {
  id: string;
  actividadId: string;
  agregadoEn: string;
}

export interface Entidad {
  id: string;
}
