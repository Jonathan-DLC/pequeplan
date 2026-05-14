"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CatalogoAdminService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, EstadoActividad } from "@/lib/models";

export default function AdminActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [categorias, setCategorias] = useState<Map<string, Categoria>>(new Map());
  const svc = new CatalogoAdminService();

  const cargar = () => {
    setActividades(svc.listar());
    const cats = new LocalStorageRepository<Categoria>("categorias").obtenerTodos();
    setCategorias(new Map(cats.map((c) => [c.id, c])));
  };

  useEffect(cargar, []);

  const toggleEstado = (act: Actividad) => {
    if (act.estado === EstadoActividad.PUBLICADA) svc.despublicar(act.id);
    else svc.publicar(act.id);
    cargar();
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar esta actividad?")) return;
    svc.eliminar(id);
    cargar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800">Actividades</h1>
        <Link href="/admin/actividades/nueva" className="rounded-xl bg-caribe-500 px-4 py-2 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
          + Nueva
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((act) => (
              <tr key={act.id} className="border-b border-slate-50 hover:bg-arena-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">{act.nombre}</td>
                <td className="px-4 py-3 text-slate-500">{categorias.get(act.categoriaId)?.nombre ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleEstado(act)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      act.estado === EstadoActividad.PUBLICADA ? "bg-selva-100 text-selva-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {act.estado === EstadoActividad.PUBLICADA ? "Publicada" : "Oculta"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/actividades/${act.id}/editar`} className="text-caribe-600 hover:underline">Editar</Link>
                  <button onClick={() => eliminar(act.id)} className="text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {actividades.length === 0 && (
          <p className="p-8 text-center text-slate-400">No hay actividades registradas</p>
        )}
      </div>
    </div>
  );
}
