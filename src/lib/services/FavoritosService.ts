import { LocalStorageRepository } from "../repositories";
import { Actividad, Favorita } from "../models";

const repo = new LocalStorageRepository<Favorita>("favoritas");
const repoAct = new LocalStorageRepository<Actividad>("actividades");

export class FavoritosService {
  agregar(actividadId: string): void {
    if (this.esFavorita(actividadId)) return;
    repo.guardar({ id: actividadId, actividadId, agregadoEn: new Date().toISOString() });
  }

  quitar(actividadId: string): void {
    repo.eliminar(actividadId);
  }

  esFavorita(actividadId: string): boolean {
    return repo.obtenerPorId(actividadId) !== null;
  }

  listar(): Actividad[] {
    const favs = repo.obtenerTodos();
    return favs
      .map((f) => repoAct.obtenerPorId(f.actividadId))
      .filter((a): a is Actividad => a !== null);
  }

  contar(): number {
    return repo.contar();
  }
}
