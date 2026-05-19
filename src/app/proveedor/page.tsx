"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProveedorService, ProveedorActividadService } from "@/lib/services";
import { Actividad, EstadoActividad, Proveedor } from "@/lib/models";

export default function PanelProveedor() {
  const { user, loading, loginConGoogle } = useAuth();
  const router = useRouter();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { setCargando(false); return; }
    new ProveedorService().obtenerPorUid(user.uid).then((p) => {
      if (!p) { router.push("/proveedor/registro"); return; }
      setProveedor(p);
      new ProveedorActividadService(p.id).listar().then((acts) => {
        setActividades(acts);
        setCargando(false);
      });
    });
  }, [user, loading, router]);

  const toggleEstado = async (act: Actividad) => {
    if (!proveedor) return;
    const svc = new ProveedorActividadService(proveedor.id);
    if (act.estado === EstadoActividad.PUBLICADA) {
      await svc.pausar(act.id);
    } else {
      await svc.reactivar(act.id);
    }
    setActividades((prev) =>
      prev.map((a) => a.id === act.id ? { ...a, estado: a.estado === EstadoActividad.PUBLICADA ? EstadoActividad.PAUSADA : EstadoActividad.PUBLICADA } : a)
    );
  };

  if (loading || cargando) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-4xl mb-4">🏪</p>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Panel de Proveedor</h1>
        <p className="text-sm text-slate-500 mb-6">Inicia sesión para acceder a tu panel.</p>
        <button onClick={loginConGoogle} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
          Iniciar con Google
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {!proveedor?.aprobado && (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 mb-6 text-sm text-yellow-800">
          ⏳ Tu registro está pendiente de aprobación por un administrador. Una vez aprobado podrás publicar actividades.
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700">🏪 {proveedor?.nombreNegocio}</h1>
          <p className="text-sm text-slate-500 mt-1">Panel de proveedor</p>
        </div>
        {proveedor?.aprobado && (
          <Link href="/proveedor/nueva" className="rounded-xl bg-caribe-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            + Nueva actividad
          </Link>
        )}
      </div>

      {actividades.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-semibold text-slate-700">No tienes actividades publicadas</p>
          <p className="mt-2 text-sm text-slate-500">Crea tu primera actividad para que los padres la encuentren</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividades.map((act) => (
            <div key={act.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
              <div>
                <h3 className="font-semibold text-slate-700">{act.nombre}</h3>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  act.estado === EstadoActividad.PUBLICADA ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {act.estado === EstadoActividad.PUBLICADA ? "Publicada" : "Pausada"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleEstado(act)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    act.estado === EstadoActividad.PUBLICADA
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {act.estado === EstadoActividad.PUBLICADA ? "⏸ Pausar" : "▶ Reactivar"}
                </button>
                <Link
                  href={`/proveedor/${act.id}/editar`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  ✏️ Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
