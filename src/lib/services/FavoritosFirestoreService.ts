import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export class FavoritosFirestoreService {
  constructor(private uid: string) {}

  private get ref() {
    if (!db) throw new Error("Firestore not available");
    return collection(db, "usuarios", this.uid, "favoritas");
  }

  async agregar(actividadId: string): Promise<void> {
    await setDoc(doc(this.ref, actividadId), {
      actividadId,
      agregadoEn: new Date().toISOString(),
    });
  }

  async quitar(actividadId: string): Promise<void> {
    await deleteDoc(doc(this.ref, actividadId));
  }

  async listarIds(): Promise<string[]> {
    const snap = await getDocs(this.ref);
    return snap.docs.map((d) => d.id);
  }
}
