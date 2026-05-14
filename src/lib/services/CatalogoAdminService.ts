import { LocalStorageRepository } from "../repositories";
import { Actividad, EstadoActividad } from "../models";

const repo = new LocalStorageRepository<Actividad>("actividades");

export class CatalogoAdminService {
  listar(): Actividad[] {
    return repo.obtenerTodos();
  }

  obtener(id: string): Actividad | null {
    return repo.obtenerPorId(id);
  }

  crear(data: Omit<Actividad, "id" | "creadoEn" | "actualizadoEn">): Actividad {
    const now = new Date().toISOString();
    const actividad: Actividad = { ...data, id: crypto.randomUUID(), creadoEn: now, actualizadoEn: now };
    return repo.guardar(actividad);
  }

  editar(id: string, data: Partial<Omit<Actividad, "id" | "creadoEn">>): Actividad | null {
    const act = repo.obtenerPorId(id);
    if (!act) return null;
    const updated = { ...act, ...data, actualizadoEn: new Date().toISOString() };
    return repo.guardar(updated);
  }

  eliminar(id: string): void {
    repo.eliminar(id);
  }

  publicar(id: string): void {
    this.editar(id, { estado: EstadoActividad.PUBLICADA });
  }

  despublicar(id: string): void {
    this.editar(id, { estado: EstadoActividad.DESPUBLICADA });
  }
}
