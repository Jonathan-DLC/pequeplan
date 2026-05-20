"use client";

import { useEffect, useState } from "react";
import { SuscripcionService, PLANES, ReservaService } from "@/lib/services";
import { Suscripcion, Reserva } from "@/lib/models";

export default function AdminFinanzas() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      new SuscripcionService().listarTodas(),
      new ReservaService().listarTodas(),
    ]).then(([subs, res]) => {
      setSuscripciones(subs.sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio)));
      setReservas(res.filter((r) => r.comision > 0).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)));
      setCargando(false);
    });
  }, []);

  if (cargando) {
    return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  const totalComisiones = reservas.reduce((s, r) => s + r.comision, 0);
  const totalSuscripciones = suscripciones.reduce((s, sub) => s + PLANES[sub.plan].precio, 0);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">💰 Finanzas</h1>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">${totalSuscripciones.toLocaleString("es-CO")}</p>
          <p className="text-xs text-green-600">Ingresos suscripciones</p>
        </div>
        <div className="rounded-2xl bg-caribe-50 p-4 text-center">
          <p className="text-2xl font-bold text-caribe-700">${totalComisiones.toLocaleString("es-CO")}</p>
          <p className="text-xs text-caribe-600">Comisiones por reservas</p>
        </div>
        <div className="rounded-2xl bg-coral-50 p-4 text-center">
          <p className="text-2xl font-bold text-coral-600">{suscripciones.length}</p>
          <p className="text-xs text-coral-500">Suscripciones totales</p>
        </div>
      </div>

      {/* Suscripciones */}
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Suscripciones</h2>
      {suscripciones.length === 0 ? (
        <p className="text-sm text-slate-400 mb-6">Sin suscripciones aún.</p>
      ) : (
        <div className="space-y-2 mb-8">
          {suscripciones.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm text-sm">
              <div>
                <span className="font-medium text-slate-700">{PLANES[s.plan].nombre}</span>
                <span className="ml-2 text-xs text-slate-400">Proveedor: {s.proveedorId.slice(0, 8)}...</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">{new Date(s.fechaInicio).toLocaleDateString("es-CO")} → {new Date(s.fechaFin).toLocaleDateString("es-CO")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comisiones */}
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Comisiones cobradas</h2>
      {reservas.length === 0 ? (
        <p className="text-sm text-slate-400">Sin comisiones aún.</p>
      ) : (
        <div className="space-y-2">
          {reservas.slice(0, 20).map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm text-sm">
              <div>
                <span className="text-slate-600">Reserva {r.id.slice(0, 8)}...</span>
                <span className="ml-2 text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</span>
              </div>
              <span className="font-semibold text-green-600">${r.comision.toLocaleString("es-CO")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
