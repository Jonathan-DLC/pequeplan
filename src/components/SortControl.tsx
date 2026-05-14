"use client";

import { CriterioOrden } from "@/lib/models";

interface Props {
  criterio: CriterioOrden;
  asc: boolean;
  onChange: (criterio: CriterioOrden, asc: boolean) => void;
}

const labels: Record<CriterioOrden, string> = {
  [CriterioOrden.NOMBRE]: "Nombre",
  [CriterioOrden.PRECIO]: "Precio",
  [CriterioOrden.ZONA]: "Zona",
  [CriterioOrden.EDAD]: "Edad",
  [CriterioOrden.HORARIO]: "Horario",
};

export function SortControl({ criterio, asc, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={criterio}
        onChange={(e) => onChange(e.target.value as CriterioOrden, asc)}
        aria-label="Ordenar por"
        className="rounded-xl border border-caribe-200 bg-white px-3 py-2 text-sm outline-none focus:border-caribe-400"
      >
        {Object.entries(labels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <button
        onClick={() => onChange(criterio, !asc)}
        aria-label={asc ? "Orden ascendente" : "Orden descendente"}
        className="rounded-xl border border-caribe-200 bg-white px-3 py-2 text-sm hover:bg-caribe-50 transition-colors"
      >
        {asc ? "↑" : "↓"}
      </button>
    </div>
  );
}
