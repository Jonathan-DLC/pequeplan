import { collection, doc, setDoc, deleteDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Actividad, EstadoActividad } from "@/lib/models";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "actividades");
}

export class ProveedorActividadService {
  constructor(private proveedorId: string) {}

  async listar(): Promise<Actividad[]> {
    const q = query(getRef(), where("proveedorId", "==", this.proveedorId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Actividad);
  }

  async crear(data: Omit<Actividad, "id" | "creadoEn" | "actualizadoEn" | "proveedorId">): Promise<Actividad> {
    const now = new Date().toISOString();
    const actividad: Actividad = {
      ...data,
      id: crypto.randomUUID(),
      proveedorId: this.proveedorId,
      creadoEn: now,
      actualizadoEn: now,
    };
    await setDoc(doc(getRef(), actividad.id), actividad);
    return actividad;
  }

  async editar(id: string, data: Partial<Omit<Actividad, "id" | "creadoEn" | "proveedorId">>): Promise<void> {
    await updateDoc(doc(getRef(), id), { ...data, actualizadoEn: new Date().toISOString() });
  }

  async pausar(id: string): Promise<void> {
    await this.editar(id, { estado: EstadoActividad.PAUSADA });
  }

  async reactivar(id: string): Promise<void> {
    await this.editar(id, { estado: EstadoActividad.PUBLICADA });
  }

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(getRef(), id));
  }
}
