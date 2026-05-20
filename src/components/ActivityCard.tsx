"use client";

import Link from "next/link";
import { Actividad, Categoria, Zona } from "@/lib/models";
import { FavoritosService } from "@/lib/services";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";

interface Props {
  actividad: Actividad;
  categoria?: Categoria;
  zona?: Zona;
}

export function ActivityCard({ actividad, categoria, zona }: Props) {
  const { user } = useAuth();
  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    setEsFav(new FavoritosService(user?.uid).esFavoritaLocal(actividad.id));
  }, [actividad.id, user]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    const svc = new FavoritosService(user?.uid);
    if (esFav) { svc.quitar(actividad.id); } else { svc.agregar(actividad.id); }
    setEsFav(!esFav);
  };

  const horarioResumen = actividad.horarios
    .slice(0, 2)
    .map((h) => `${h.diaSemana.slice(0, 3)} ${h.horaInicio}`)
    .join(" · ");

  return (
    <Link
      href={`/actividad/${actividad.id}`}
      className={`group relative block rounded-3xl bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        actividad.destacada ? "ring-2 ring-yellow-300 shadow-yellow-100" : "shadow-caribe-100 hover:shadow-caribe-200/50"
      }`}
    >
      {/* Badge destacada */}
      {actividad.destacada && (
        <span className="absolute top-3 left-3 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">⭐ Destacada</span>
      )}

      {/* Botón favorita */}
      <button
        onClick={toggleFav}
        aria-label={esFav ? "Quitar de favoritas" : "Guardar como favorita"}
        className="absolute top-4 right-4 text-lg transition-transform hover:scale-125"
      >
        {esFav ? "❤️" : "🤍"}
      </button>

      <div className="mb-3 flex items-start justify-between gap-2 pr-8">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-caribe-700 group-hover:text-coral-500 transition-colors">
          {actividad.nombre}
        </h3>
        {categoria && (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: categoria.color ?? "#6b7280" }}
          >
            {categoria.nombre}
          </span>
        )}
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-slate-600">
        {actividad.descripcion}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {zona && (
          <span className="rounded-lg bg-arena-100 px-2 py-0.5">📍 {zona.nombre}</span>
        )}
        {horarioResumen && (
          <span className="rounded-lg bg-caribe-50 px-2 py-0.5">🕐 {horarioResumen}</span>
        )}
        <span className="ml-auto font-semibold text-sm text-coral-600">
          {actividad.esGratuita ? "Gratis" : `$${(actividad.precioDesde ?? 0).toLocaleString("es-CO")}`}
        </span>
      </div>
    </Link>
  );
}
