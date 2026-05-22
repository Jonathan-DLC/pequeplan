import { collection, doc, setDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reserva } from "@/lib/models";
import { SuscripcionService, PLANES } from "./SuscripcionService";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "reservas");
}

export class ReservaService {
  async preinscribir(actividadId: string, uid: string, datos: { nombreNino: string; edadNino: number; nombrePadre: string; telefonoPadre: string }, proveedorId: string | null, precioActividad: number | null, esGratuita: boolean): Promise<Reserva> {
    const reserva: Reserva = {
      id: crypto.randomUUID(),
      actividadId,
      proveedorId,
      uid,
      nombreNino: datos.nombreNino,
      edadNino: datos.edadNino,
      nombrePadre: datos.nombrePadre,
      telefonoPadre: datos.telefonoPadre,
      estado: "PENDIENTE",
      comision: 0,
      precioActividad: precioActividad || 0,
      esGratuita,
      creadoEn: new Date().toISOString(),
    };
    await setDoc(doc(getRef(), reserva.id), reserva);
    return reserva;
  }

  async aceptar(id: string, esGratuita: boolean): Promise<void> {
    const nuevoEstado = esGratuita ? "CONFIRMADA" : "ACEPTADA";
    await updateDoc(doc(getRef(), id), { estado: nuevoEstado });
  }

  async rechazar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { estado: "RECHAZADA" });
  }

  async confirmarPago(id: string, proveedorId: string | null, precioActividad: number): Promise<void> {
    let comision = 0;
    if (proveedorId) {
      const sub = await new SuscripcionService().obtenerActiva(proveedorId);
      const porcentaje = sub ? PLANES[sub.plan].comision : 10;
      comision = Math.round(precioActividad * porcentaje / 100);
    }
    await updateDoc(doc(getRef(), id), { estado: "CONFIRMADA", comision });
  }

  async cancelar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { estado: "CANCELADA" });
  }

  async listarPorUsuario(uid: string): Promise<Reserva[]> {
    const q = query(getRef(), where("uid", "==", uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Reserva);
  }

  async listarPorProveedor(proveedorId: string): Promise<Reserva[]> {
    const q = query(getRef(), where("proveedorId", "==", proveedorId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Reserva);
  }

  async listarTodas(): Promise<Reserva[]> {
    const snap = await getDocs(getRef());
    return snap.docs.map((d) => d.data() as Reserva);
  }

  async contarConfirmadasPorActividad(actividadId: string): Promise<number> {
    const q = query(getRef(), where("actividadId", "==", actividadId), where("estado", "==", "CONFIRMADA"));
    const snap = await getDocs(q);
    return snap.size;
  }
}
