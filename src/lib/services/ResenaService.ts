import { collection, doc, setDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Resena } from "@/lib/models";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "resenas");
}

export class ResenaService {
  async crear(data: Omit<Resena, "id" | "creadoEn" | "respuestaProveedor">): Promise<Resena> {
    const resena: Resena = { ...data, id: crypto.randomUUID(), respuestaProveedor: null, creadoEn: new Date().toISOString() };
    await setDoc(doc(getRef(), resena.id), resena);
    return resena;
  }

  async listarPorActividad(actividadId: string): Promise<Resena[]> {
    const q = query(getRef(), where("actividadId", "==", actividadId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Resena).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }

  async responder(id: string, respuesta: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { respuestaProveedor: respuesta });
  }
}
