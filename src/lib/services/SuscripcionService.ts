import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Suscripcion } from "@/lib/models";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "suscripciones");
}

export const PLANES = {
  BASICO: { nombre: "Básico", precio: 50000, duracionDias: 30, comision: 10 },
  PREMIUM: { nombre: "Premium", precio: 120000, duracionDias: 30, comision: 5 },
} as const;

export class SuscripcionService {
  async suscribir(proveedorId: string, plan: "BASICO" | "PREMIUM"): Promise<Suscripcion> {
    const ahora = new Date();
    const fin = new Date(ahora);
    fin.setDate(fin.getDate() + PLANES[plan].duracionDias);
    const sub: Suscripcion = {
      id: crypto.randomUUID(),
      proveedorId,
      plan,
      fechaInicio: ahora.toISOString(),
      fechaFin: fin.toISOString(),
      activa: true,
    };
    await setDoc(doc(getRef(), sub.id), sub);
    return sub;
  }

  async obtenerActiva(proveedorId: string): Promise<Suscripcion | null> {
    const q = query(getRef(), where("proveedorId", "==", proveedorId), where("activa", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const sub = snap.docs[0].data() as Suscripcion;
    if (new Date(sub.fechaFin) < new Date()) return null;
    return sub;
  }

  async listarTodas(): Promise<Suscripcion[]> {
    const snap = await getDocs(getRef());
    return snap.docs.map((d) => d.data() as Suscripcion);
  }
}
