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

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const svc = new FavoritosService(user?.uid);
    const nuevoEstado = !esFav;
    setEsFav(nuevoEstado);
    try {
      if (esFav) { await svc.quitar(actividad.id); } else { await svc.agregar(actividad.id); }
    } catch (error) {
      console.error("Error al guardar favorito:", error);
      setEsFav(esFav);
    }
  };

  const horarioResumen = actividad.horarios
    .slice(0, 2)
    .map((h) => `${h.diaSemana.slice(0, 3)} ${h.horaInicio}`)
    .join(" · ");

  return (
    <Link
      href={`/actividad/${actividad.id}`}
      className={`hover-lift group relative block rounded-2xl bg-white/80 backdrop-blur-sm p-6 ${
        actividad.destacada ? "ring-1 ring-yellow-300/60 bg-yellow-50/30" : ""
      }`}
    >
      {/* Destacada */}
      {actividad.destacada && (
        <span className="absolute -top-2 left-4 rounded-full bg-yellow-400 px-2.5 py-0.5 text-[10px] font-bold text-yellow-900 shadow-sm">⭐ Destacada</span>
      )}

      {/* Favorita */}
      <button
        onClick={toggleFav}
        aria-label={esFav ? "Quitar de favoritas" : "Guardar como favorita"}
        className="absolute top-4 right-4 text-base transition-transform duration-200 hover:scale-125"
      >
        {esFav ? "❤️" : "🤍"}
      </button>

      {/* Categoría como acento superior */}
      {categoria && (
        <span
          className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white mb-3"
          style={{ backgroundColor: categoria.color ?? "#6b7280" }}
        >
          {categoria.nombre}
        </span>
      )}

      {/* Título */}
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-800 leading-tight group-hover:text-caribe-600 transition-colors pr-8">
        {actividad.nombre}
      </h3>

      {/* Descripción */}
      <p className="mt-2 line-clamp-2 text-sm text-slate-500 leading-relaxed">
        {actividad.descripcion}
      </p>

      {/* Metadata */}
      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
        {zona && <span>📍 {zona.nombre}</span>}
        {horarioResumen && <span>🕐 {horarioResumen}</span>}
      </div>

      {/* Precio */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <span className="font-[family-name:var(--font-display)] text-base font-bold text-coral-500">
          {actividad.esGratuita ? "Gratis" : `$${(actividad.precioDesde ?? 0).toLocaleString("es-CO")}`}
        </span>
      </div>
    </Link>
  );
}
