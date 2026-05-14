"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BuscadorService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, RangoEdad, Zona } from "@/lib/models";

export default function DetalleActividad() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [rango, setRango] = useState<RangoEdad | null>(null);
  const [zona, setZona] = useState<Zona | null>(null);

  useEffect(() => {
    const svc = new BuscadorService();
    const act = svc.verDetalle(id);
    if (!act) { router.push("/"); return; }
    setActividad(act);
    setCategoria(new LocalStorageRepository<Categoria>("categorias").obtenerPorId(act.categoriaId));
    setRango(new LocalStorageRepository<RangoEdad>("rangos-edad").obtenerPorId(act.rangoEdadId));
    setZona(new LocalStorageRepository<Zona>("zonas").obtenerPorId(act.zonaId));
  }, [id, router]);

  if (!actividad) return null;

  const dias: Record<string, string> = { LUNES: "Lunes", MARTES: "Martes", MIERCOLES: "Miércoles", JUEVES: "Jueves", VIERNES: "Viernes", SABADO: "Sábado", DOMINGO: "Domingo" };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Volver */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-caribe-600 hover:text-caribe-800 mb-6 transition-colors">
        ← Volver al catálogo
      </Link>

      {/* Hero */}
      <div
        className="rounded-3xl p-8 mb-8"
        style={{ background: `linear-gradient(135deg, ${categoria?.color ?? "#06b6d4"}22, ${categoria?.color ?? "#06b6d4"}08)` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {categoria && (
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white mb-3" style={{ backgroundColor: categoria.color ?? "#6b7280" }}>
                {categoria.nombre}
              </span>
            )}
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-slate-800 md:text-4xl">
              {actividad.nombre}
            </h1>
          </div>
          <span className="text-2xl font-bold text-coral-600">
            {actividad.esGratuita ? "Gratis" : `$${(actividad.precioDesde ?? 0).toLocaleString("es-CO")}${actividad.precioHasta ? ` - $${actividad.precioHasta.toLocaleString("es-CO")}` : ""}`}
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Contenido principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Descripción */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Descripción</h2>
            <p className="text-slate-600 leading-relaxed">{actividad.descripcion}</p>
          </section>

          {/* Horarios */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Horarios</h2>
            <div className="space-y-2">
              {actividad.horarios.map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-caribe-50 px-4 py-2 text-sm">
                  <span className="font-medium text-caribe-700">{dias[h.diaSemana]}</span>
                  <span className="text-slate-600">{h.horaInicio} — {h.horaFin}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Info rápida */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            {zona && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Zona</p>
                <p className="text-sm text-slate-700">📍 {zona.nombre}</p>
              </div>
            )}
            {rango && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Edad</p>
                <p className="text-sm text-slate-700">👶 {rango.etiqueta}</p>
              </div>
            )}
            {actividad.moneda && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Precio</p>
                <p className="text-sm text-slate-700">💰 {actividad.moneda}</p>
              </div>
            )}
          </div>

          {/* Contacto */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-slate-700">Contacto</h3>
            {actividad.contacto.direccion && (
              <p className="text-sm text-slate-600">📍 {actividad.contacto.direccion}</p>
            )}
            {actividad.contacto.telefono && (
              <p className="text-sm"><a href={`tel:${actividad.contacto.telefono}`} className="text-caribe-600 hover:underline">📞 {actividad.contacto.telefono}</a></p>
            )}
            {actividad.contacto.whatsapp && (
              <p className="text-sm"><a href={`https://wa.me/57${actividad.contacto.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-selva-600 hover:underline">💬 WhatsApp</a></p>
            )}
            {actividad.contacto.email && (
              <p className="text-sm"><a href={`mailto:${actividad.contacto.email}`} className="text-caribe-600 hover:underline">✉️ {actividad.contacto.email}</a></p>
            )}
            {actividad.contacto.sitioWeb && (
              <p className="text-sm"><a href={actividad.contacto.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-caribe-600 hover:underline">🌐 Sitio web</a></p>
            )}
            {actividad.contacto.instagram && (
              <p className="text-sm"><a href={`https://instagram.com/${actividad.contacto.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-coral-500 hover:underline">📸 {actividad.contacto.instagram}</a></p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
