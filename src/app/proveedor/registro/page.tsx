"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProveedorService } from "@/lib/services";

export default function RegistroProveedor() {
  const { user, loading, loginConGoogle } = useAuth();
  const router = useRouter();
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [guardando, setGuardando] = useState(false);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-4xl mb-4">🏪</p>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Regístrate como proveedor</h1>
        <p className="text-sm text-slate-500 mb-6">Inicia sesión con Google para registrar tu negocio.</p>
        <button onClick={loginConGoogle} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
          Iniciar con Google
        </button>
      </div>
    );
  }

  const guardar = async () => {
    if (!nombreNegocio || !telefono) { alert("Nombre del negocio y teléfono son obligatorios"); return; }
    setGuardando(true);
    await new ProveedorService().registrar({
      uid: user.uid,
      nombreNegocio,
      descripcion,
      telefono,
      email: email || user.email || "",
    });
    router.push("/proveedor");
  };

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400";
  const label = "block text-xs font-semibold text-slate-500 uppercase mb-1";

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700 mb-6">🏪 Registro de Proveedor</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className={label}>Nombre del negocio *</label>
          <input value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} className={input} placeholder="Ej: Academia de Natación Delfines" />
        </div>
        <div>
          <label className={label}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={input} placeholder="Describe brevemente tu negocio..." />
        </div>
        <div>
          <label className={label}>Teléfono de contacto *</label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className={input} placeholder="300 123 4567" />
        </div>
        <div>
          <label className={label}>Email de contacto</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder={user.email || "correo@ejemplo.com"} />
        </div>
        <button onClick={guardar} disabled={guardando} className="w-full rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors disabled:opacity-50">
          {guardando ? "Registrando..." : "Registrar negocio"}
        </button>
      </div>
    </div>
  );
}
