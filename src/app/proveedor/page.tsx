"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProveedorService, ProveedorActividadService, SuscripcionService, ReservaService } from "@/lib/services";
import { Actividad, EstadoActividad, Proveedor, Suscripcion, Reserva } from "@/lib/models";

export default function PanelProveedor() {
  const { user, loading, loginConGoogle } = useAuth();
  const router = useRouter();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
  const [inscritos, setInscritos] = useState<Record<string, Reserva[]>>({});
  const [expandido, setExpandido] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { setCargando(false); return; }
    new ProveedorService().obtenerPorUid(user.uid).then(async (p) => {
      if (!p) { router.push("/proveedor/registro"); return; }
      setProveedor(p);
      const [acts, sub] = await Promise.all([
        new ProveedorActividadService(p.id).listar(),
        new SuscripcionService().obtenerActiva(p.id),
      ]);
      setActividades(acts);
      setSuscripcion(sub);
      const todas = await new ReservaService().listarTodas();
      const inscMap: Record<string, Reserva[]> = {};
      acts.forEach((act) => {
        inscMap[act.id] = todas.filter((r) => r.actividadId === act.id && r.estado === "ACTIVA");
      });
      setInscritos(inscMap);
      setCargando(false);
    });
  }, [user, loading, router]);

  const toggleEstado = async (act: Actividad) => {
    if (!proveedor) return;
    const svc = new ProveedorActividadService(proveedor.id);
    if (act.estado === EstadoActividad.PUBLICADA) { await svc.pausar(act.id); } else { await svc.reactivar(act.id); }
    setActividades((prev) => prev.map((a) => a.id === act.id ? { ...a, estado: a.estado === EstadoActividad.PUBLICADA ? EstadoActividad.PAUSADA : EstadoActividad.PUBLICADA } : a));
  };

  const toggleDestacar = async (act: Actividad) => {
    if (!proveedor) return;
    await new ProveedorActividadService(proveedor.id).editar(act.id, { destacada: !act.destacada });
    setActividades((prev) => prev.map((a) => a.id === act.id ? { ...a, destacada: !a.destacada } : a));
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
        <button onClick={loginConGoogle} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">Iniciar con Google</button>
      </div>
    );
  }

  const esPremium = suscripcion?.plan === "PREMIUM";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {!proveedor?.aprobado && (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 mb-6 text-sm text-yellow-800">
          ⏳ Tu registro está pendiente de aprobación por un administrador.
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700">🏪 {proveedor?.nombreNegocio}</h1>
          <p className="text-sm text-slate-500 mt-1">Panel de proveedor</p>
        </div>
        <div className="flex gap-2">
          <Link href="/proveedor/planes" className="rounded-xl border border-caribe-200 px-4 py-2.5 text-sm font-semibold text-caribe-600 hover:bg-caribe-50 transition-colors">💎 Planes</Link>
          {proveedor?.aprobado && <Link href="/proveedor/nueva" className="rounded-xl bg-caribe-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">+ Nueva actividad</Link>}
        </div>
      </div>
      {suscripcion && (
        <div className="rounded-2xl bg-caribe-50 border border-caribe-200 p-4 mb-6 text-sm text-caribe-800 flex items-center justify-between">
          <span>✅ Plan <strong>{suscripcion.plan}</strong> activo hasta {new Date(suscripcion.fechaFin).toLocaleDateString("es-CO")}</span>
          {esPremium && <span className="text-xs bg-caribe-200 rounded-full px-2 py-0.5">Puedes destacar actividades</span>}
        </div>
      )}
      {actividades.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-semibold text-slate-700">No tienes actividades publicadas</p>
          <p className="mt-2 text-sm text-slate-500">Crea tu primera actividad para que los padres la encuentren</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividades.map((act) => (
            <div key={act.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-700">{act.destacada && "⭐ "}{act.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${act.estado === EstadoActividad.PUBLICADA ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{act.estado === EstadoActividad.PUBLICADA ? "Publicada" : "Pausada"}</span>
                    <span className="text-xs text-slate-400">👧 {inscritos[act.id]?.length || 0} inscritos</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {esPremium && <button onClick={() => toggleDestacar(act)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${act.destacada ? "bg-yellow-200 text-yellow-800" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}>{act.destacada ? "★ Destacada" : "☆ Destacar"}</button>}
                  <button onClick={() => toggleEstado(act)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${act.estado === EstadoActividad.PUBLICADA ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>{act.estado === EstadoActividad.PUBLICADA ? "⏸ Pausar" : "▶ Reactivar"}</button>
                  <Link href={`/proveedor/${act.id}/editar`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors">✏️ Editar</Link>
                  <button onClick={() => setExpandido(expandido === act.id ? null : act.id)} className="rounded-lg bg-caribe-50 px-3 py-1.5 text-xs font-medium text-caribe-700 hover:bg-caribe-100 transition-colors">👧 Ver inscritos</button>
                </div>
              </div>
              {expandido === act.id && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {(inscritos[act.id]?.length || 0) === 0 ? (
                    <p className="text-xs text-slate-400">Sin inscripciones aún.</p>
                  ) : (
                    <div className="space-y-2">{inscritos[act.id].map((r) => (<div key={r.id} className="flex items-center justify-between text-sm"><span className="text-slate-600">👧 {r.nombreNino}</span><span className="text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</span></div>))}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
