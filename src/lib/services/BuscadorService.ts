import { LocalStorageRepository } from "../repositories";
import { Actividad, CriterioOrden, DiaSemana, EstadoActividad } from "../models";

const repo = new LocalStorageRepository<Actividad>("actividades");

export interface FiltrosBusqueda {
  categoriaId?: string;
  rangoEdadId?: string;
  zonaId?: string;
  diaSemana?: DiaSemana;
}

export class BuscadorService {
  buscar(): Actividad[] {
    return repo.obtenerTodos().filter((a) => a.estado === EstadoActividad.PUBLICADA);
  }

  buscarPorTexto(texto: string): Actividad[] {
    const t = texto.toLowerCase();
    return this.buscar().filter(
      (a) => a.nombre.toLowerCase().includes(t) || a.descripcion.toLowerCase().includes(t)
    );
  }

  filtrar(filtros: FiltrosBusqueda): Actividad[] {
    let resultado = this.buscar();
    if (filtros.categoriaId) resultado = resultado.filter((a) => a.categoriaId === filtros.categoriaId);
    if (filtros.rangoEdadId) resultado = resultado.filter((a) => a.rangoEdadId === filtros.rangoEdadId);
    if (filtros.zonaId) resultado = resultado.filter((a) => a.zonaId === filtros.zonaId);
    if (filtros.diaSemana) resultado = resultado.filter((a) => a.horarios.some((h) => h.diaSemana === filtros.diaSemana));
    return resultado;
  }

  ordenar(lista: Actividad[], criterio: CriterioOrden, asc = true): Actividad[] {
    const sorted = [...lista].sort((a, b) => {
      switch (criterio) {
        case CriterioOrden.NOMBRE:
          return a.nombre.localeCompare(b.nombre);
        case CriterioOrden.PRECIO:
          return (a.precioDesde ?? 0) - (b.precioDesde ?? 0);
        case CriterioOrden.ZONA:
          return a.zonaId.localeCompare(b.zonaId);
        case CriterioOrden.EDAD:
          return a.rangoEdadId.localeCompare(b.rangoEdadId);
        case CriterioOrden.HORARIO:
          const ha = a.horarios[0]?.horaInicio ?? "99:99";
          const hb = b.horarios[0]?.horaInicio ?? "99:99";
          return ha.localeCompare(hb);
        default:
          return 0;
      }
    });
    return asc ? sorted : sorted.reverse();
  }

  verDetalle(id: string): Actividad | null {
    const act = repo.obtenerPorId(id);
    if (act && act.estado === EstadoActividad.PUBLICADA) return act;
    return null;
  }
}
