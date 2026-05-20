"use client";

import { useEffect, useMemo, useState } from "react";
import { BuscadorService, FiltrosBusqueda } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, CriterioOrden, RangoEdad, Zona } from "@/lib/models";
import { ActivityCard } from "@/components/ActivityCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { SortControl } from "@/components/SortControl";

export default function Home() {
  const [texto, setTexto] = useState("");
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({});
  const [criterio, setCriterio] = useState(CriterioOrden.NOMBRE);
  const [asc, setAsc] = useState(true);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [rangosEdad, setRangosEdad] = useState<RangoEdad[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);

  const svc = useMemo(() => new BuscadorService(), []);

  useEffect(() => {
    setCategorias(new LocalStorageRepository<Categoria>("categorias").obtenerTodos());
    setRangosEdad(new LocalStorageRepository<RangoEdad>("rangos-edad").obtenerTodos());
    setZonas(new LocalStorageRepository<Zona>("zonas").obtenerTodos());
  }, []);

  useEffect(() => {
    let resultado: Actividad[];
    if (texto) {
      resultado = svc.buscarPorTexto(texto);
    } else if (Object.values(filtros).some(Boolean)) {
      resultado = svc.filtrar(filtros);
    } else {
      resultado = svc.buscar();
    }
    setActividades(svc.ordenar(resultado, criterio, asc));
  }, [texto, filtros, criterio, asc, svc]);

  const catMap = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
  const zonaMap = useMemo(() => new Map(zonas.map((z) => [z.id, z])), [zonas]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="gradient-mesh mb-10 rounded-3xl px-8 py-12 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-caribe-700 md:text-5xl tracking-tight">
          Encuentra la actividad perfecta
        </h1>
        <p className="mt-3 text-lg text-slate-600/80 max-w-xl mx-auto">
          Actividades educativas, deportivas y culturales para niños en Barranquilla
        </p>
      </section>

      {/* Búsqueda */}
      <section className="mb-6">
        <SearchBar value={texto} onChange={setTexto} />
      </section>

      {/* Filtros y orden */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterPanel
          filtros={filtros}
          onChange={setFiltros}
          categorias={categorias}
          rangosEdad={rangosEdad}
          zonas={zonas}
        />
        <SortControl
          criterio={criterio}
          asc={asc}
          onChange={(c, a) => { setCriterio(c); setAsc(a); }}
        />
      </section>

      {/* Resultados */}
      <section>
        <p className="mb-4 text-sm text-slate-500">
          {actividades.length} actividad{actividades.length !== 1 ? "es" : ""} encontrada{actividades.length !== 1 ? "s" : ""}
        </p>

        {actividades.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-lg font-semibold text-slate-700">No se encontraron actividades</p>
            <p className="mt-1 text-sm text-slate-500">Intenta ajustar los filtros o el texto de búsqueda</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {actividades.map((act) => (
              <ActivityCard
                key={act.id}
                actividad={act}
                categoria={catMap.get(act.categoriaId)}
                zona={zonaMap.get(act.zonaId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
