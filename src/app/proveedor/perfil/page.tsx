"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProveedorService } from "@/lib/services";
import { Proveedor } from "@/lib/models";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PerfilProveedor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    new ProveedorService().obtenerPorUid(user.uid).then((p) => {
      if (!p) { router.push("/proveedor/registro"); return; }
      setProveedor(p);
      setNombreNegocio(p.nombreNegocio);
      setDescripcion(p.descripcion);
      setTelefono(p.telefono);
      setEmail(p.email);
    });
  }, [user, loading, router]);

  const guardar = async () => {
    if (!proveedor || !nombreNegocio || !telefono || !db) return;
    setGuardando(true);
    await updateDoc(doc(db, "proveedores", proveedor.id), {
      nombreNegocio, descripcion, telefono, email,
    });
    setGuardando(false);
    setExito(true);
    setTimeout(() => setExito(false), 2000);
  };

  if (loading || !proveedor) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400";
  const label = "block text-xs font-semibold text-slate-500 uppercase mb-1";

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700 mb-6">✏️ Editar Perfil del Negocio</h1>
      {exito && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-3 mb-4 text-sm text-green-700">✅ Datos actualizados correctamente</div>
      )}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className={label}>Nombre del negocio *</label>
          <input value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} className={input} />
        </div>
        <div>
          <label className={label}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={input} />
        </div>
        <div>
          <label className={label}>Teléfono *</label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className={input} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div className="flex gap-3">
          <button onClick={guardar} disabled={guardando} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors disabled:opacity-50">
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button onClick={() => router.push("/proveedor")} className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
