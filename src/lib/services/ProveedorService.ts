import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proveedor } from "@/lib/models";

function getRef() {
  if (!db) throw new Error("Firestore not available");
  return collection(db, "proveedores");
}

export class ProveedorService {
  async registrar(data: Omit<Proveedor, "id" | "creadoEn" | "aprobado" | "verificado">): Promise<Proveedor> {
    const proveedor: Proveedor = {
      ...data,
      id: crypto.randomUUID(),
      aprobado: false,
      verificado: false,
      creadoEn: new Date().toISOString(),
    };
    await setDoc(doc(getRef(), proveedor.id), proveedor);
    return proveedor;
  }

  async obtenerPorUid(uid: string): Promise<Proveedor | null> {
    const q = query(getRef(), where("uid", "==", uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Proveedor;
  }

  async obtenerPorId(id: string): Promise<Proveedor | null> {
    const snap = await getDoc(doc(getRef(), id));
    return snap.exists() ? (snap.data() as Proveedor) : null;
  }

  async listarTodos(): Promise<Proveedor[]> {
    const snap = await getDocs(getRef());
    return snap.docs.map((d) => d.data() as Proveedor);
  }

  async aprobar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { aprobado: true });
  }

  async rechazar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { aprobado: false });
  }

  async verificar(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { verificado: true });
  }

  async quitarVerificacion(id: string): Promise<void> {
    await updateDoc(doc(getRef(), id), { verificado: false });
  }
}
