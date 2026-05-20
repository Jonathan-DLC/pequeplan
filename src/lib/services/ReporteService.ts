import { collection, doc, setDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reporte } from "@/lib/models";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "reportes");
}

export class ReporteService {
  async crear(data: Omit<Reporte, "id" | "creadoEn" | "estado">): Promise<void> {
    const reporte: Reporte = { ...data, id: crypto.randomUUID(), estado: "PENDIENTE", creadoEn: new Date().toISOString() };
    await setDoc(doc(getRef(), reporte.id), reporte);
  }

  async listarTodos(): Promise<Reporte[]> {
    const snap = await getDocs(getRef());
    return snap.docs.map((d) => d.data() as Reporte).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }

  async resolver(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { estado: "RESUELTO" });
  }
}
