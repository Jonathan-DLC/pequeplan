import { collection, doc, setDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reserva } from "@/lib/models";
import { SuscripcionService, PLANES } from "./SuscripcionService";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "reservas");
}

export class ReservaService {
  async inscribir(actividadId: string, uid: string, nombreNino: string, proveedorId?: string | null, precioActividad?: number | null): Promise<Reserva> {
    let comision = 0;
    if (proveedorId && precioActividad) {
      const sub = await new SuscripcionService().obtenerActiva(proveedorId);
      const porcentaje = sub ? PLANES[sub.plan].comision : 10;
      comision = Math.round(precioActividad * porcentaje / 100);
    }
    const reserva: Reserva = {
      id: crypto.randomUUID(),
      actividadId,
      uid,
      nombreNino,
      estado: "ACTIVA",
      comision,
      creadoEn: new Date().toISOString(),
    };
    await setDoc(doc(getRef(), reserva.id), reserva);
    return reserva;
  }

  async cancelar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { estado: "CANCELADA" });
  }

  async listarPorUsuario(uid: string): Promise<Reserva[]> {
    const q = query(getRef(), where("uid", "==", uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Reserva);
  }

  async listarTodas(): Promise<Reserva[]> {
    const snap = await getDocs(getRef());
    return snap.docs.map((d) => d.data() as Reserva);
  }

  async contarActivasPorActividad(actividadId: string): Promise<number> {
    const q = query(getRef(), where("actividadId", "==", actividadId), where("estado", "==", "ACTIVA"));
    const snap = await getDocs(q);
    return snap.size;
  }
}
