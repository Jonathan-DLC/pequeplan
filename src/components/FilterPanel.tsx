"use client";

import { Categoria, DiaSemana, RangoEdad, Zona } from "@/lib/models";
import { FiltrosBusqueda } from "@/lib/services";

interface Props {
  filtros: FiltrosBusqueda;
  onChange: (filtros: FiltrosBusqueda) => void;
  categorias: Categoria[];
  rangosEdad: RangoEdad[];
  zonas: Zona[];
}

export function FilterPanel({ filtros, onChange, categorias, rangosEdad, zonas }: Props) {
  const dias = Object.values(DiaSemana);

  const select = "rounded-xl border border-caribe-200 bg-white px-3 py-2 text-sm outline-none focus:border-caribe-400 transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filtros.categoriaId ?? ""}
        onChange={(e) => onChange({ ...filtros, categoriaId: e.target.value || undefined })}
        aria-label="Filtrar por categoría"
        className={select}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <select
        value={filtros.rangoEdadId ?? ""}
        onChange={(e) => onChange({ ...filtros, rangoEdadId: e.target.value || undefined })}
        aria-label="Filtrar por edad"
        className={select}
      >
        <option value="">Todas las edades</option>
        {rangosEdad.map((r) => (
          <option key={r.id} value={r.id}>{r.etiqueta}</option>
        ))}
      </select>

      <select
        value={filtros.zonaId ?? ""}
        onChange={(e) => onChange({ ...filtros, zonaId: e.target.value || undefined })}
        aria-label="Filtrar por zona"
        className={select}
      >
        <option value="">Todas las zonas</option>
        {zonas.map((z) => (
          <option key={z.id} value={z.id}>{z.nombre}</option>
        ))}
      </select>

      <select
        value={filtros.diaSemana ?? ""}
        onChange={(e) => onChange({ ...filtros, diaSemana: (e.target.value || undefined) as DiaSemana | undefined })}
        aria-label="Filtrar por día"
        className={select}
      >
        <option value="">Todos los días</option>
        {dias.map((d) => (
          <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
        ))}
      </select>
    </div>
  );
}
