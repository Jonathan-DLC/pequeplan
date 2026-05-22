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
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { setCargando(false); return; }
    new ProveedorService().obtenerPorUid(user.uid).then(async (p) => {
      if (!p) { router.push("/proveedor/registro"); return; }
      setProveedor(p);
      const [acts, sub, res] = await Promise.all([
        new ProveedorActividadService(p.id).listar(),
        new SuscripcionService().obtenerActiva(p.id),
        new ReservaService().listarPorProveedor(p.id),
      ]);
      setActividades(acts);
      setSuscripcion(sub);
      setReservas(res);
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

  const aceptarReserva = async (r: Reserva) => {
    await new ReservaService().aceptar(r.id, r.esGratuita);
    setReservas((prev) => prev.map((x) => x.id === r.id ? { ...x, estado: r.esGratuita ? "CONFIRMADA" : "ACEPTADA" } : x));
  };

  const rechazarReserva = async (id: string) => {
    await new ReservaService().rechazar(id);
    setReservas((prev) => prev.map((x) => x.id === id ? { ...x, estado: "RECHAZADA" } : x));
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
  const pendientes = reservas.filter((r) => r.estado === "PENDIENTE");
  const confirmadas = (actId: string) => reservas.filter((r) => r.actividadId === actId && r.estado === "CONFIRMADA");

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
          <Link href="/proveedor/perfil" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">✏️ Perfil</Link>
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

      {/* Solicitudes pendientes */}
      {pendientes.length > 0 && (
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">📥 Solicitudes pendientes ({pendientes.length})</h2>
          <div className="space-y-3">
            {pendientes.map((r) => (
              <div key={r.id} className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-700">👧 {r.nombreNino} {r.edadNino ? `(${r.edadNino} años)` : ""}</p>
                  <p className="text-xs text-slate-500">👤 {r.nombrePadre} · 📞 {r.telefonoPadre}</p>
                  <p className="text-xs text-slate-400">Actividad: {actividades.find((a) => a.id === r.actividadId)?.nombre} · {r.esGratuita ? "Gratis" : `$${r.precioActividad.toLocaleString("es-CO")}`}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => aceptarReserva(r)} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200">✓ Aceptar</button>
                  <button onClick={() => rechazarReserva(r.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">✗ Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actividades */}
      {actividades.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-semibold text-slate-700">No tienes actividades publicadas</p>
          <p className="mt-2 text-sm text-slate-500">Crea tu primera actividad para que los padres la encuentren</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividades.map((act) => {
            const inscritos = confirmadas(act.id);
            return (
              <div key={act.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-700">{act.destacada && "⭐ "}{act.nombre}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${act.estado === EstadoActividad.PUBLICADA ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{act.estado === EstadoActividad.PUBLICADA ? "Publicada" : "Pausada"}</span>
                      <span className="text-xs text-slate-400">👧 {inscritos.length} confirmados</span>
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
                    {inscritos.length === 0 ? (
                      <p className="text-xs text-slate-400">Sin inscripciones confirmadas aún.</p>
                    ) : (
                      <div className="space-y-3">{inscritos.map((r) => (
                        <div key={r.id} className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-slate-700">👧 {r.nombreNino} {r.edadNino ? `(${r.edadNino} años)` : ""}</span>
                            <span className="text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</span>
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-slate-500">
                            <span>👤 {r.nombrePadre}</span>
                            {r.telefonoPadre && <a href={`tel:${r.telefonoPadre}`} className="text-caribe-600 hover:underline">📞 {r.telefonoPadre}</a>}
                            {r.telefonoPadre && <a href={`https://wa.me/57${r.telefonoPadre.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-selva-600 hover:underline">💬 WhatsApp</a>}
                          </div>
                        </div>
                      ))}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
