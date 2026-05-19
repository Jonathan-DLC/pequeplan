import { LocalStorageRepository } from "../repositories";
import { Actividad, Favorita } from "../models";
import { FavoritosFirestoreService } from "./FavoritosFirestoreService";

const repo = new LocalStorageRepository<Favorita>("favoritas");
const repoAct = new LocalStorageRepository<Actividad>("actividades");

export class FavoritosService {
  private firestore: FavoritosFirestoreService | null;

  constructor(uid?: string | null) {
    this.firestore = uid ? new FavoritosFirestoreService(uid) : null;
  }

  async agregar(actividadId: string): Promise<void> {
    if (this.firestore) {
      await this.firestore.agregar(actividadId);
    }
    // Siempre guardar en localStorage también (cache local)
    if (!this.esFavoritaLocal(actividadId)) {
      repo.guardar({ id: actividadId, actividadId, agregadoEn: new Date().toISOString() });
    }
  }

  async quitar(actividadId: string): Promise<void> {
    if (this.firestore) {
      await this.firestore.quitar(actividadId);
    }
    repo.eliminar(actividadId);
  }

  esFavoritaLocal(actividadId: string): boolean {
    return repo.obtenerPorId(actividadId) !== null;
  }

  listarLocal(): Actividad[] {
    const favs = repo.obtenerTodos();
    return favs
      .map((f) => repoAct.obtenerPorId(f.actividadId))
      .filter((a): a is Actividad => a !== null);
  }

  async sincronizarDesdeFirestore(): Promise<void> {
    if (!this.firestore) return;
    const ids = await this.firestore.listarIds();
    // Limpiar localStorage y recargar desde Firestore
    repo.limpiar();
    ids.forEach((id) => {
      repo.guardar({ id, actividadId: id, agregadoEn: new Date().toISOString() });
    });
  }

  contar(): number {
    return repo.contar();
  }
}
