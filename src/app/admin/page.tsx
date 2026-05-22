"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, EstadoActividad } from "@/lib/models";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [categorias, setCategorias] = useState<Map<string, Categoria>>(new Map());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cats = new LocalStorageRepository<Categoria>("categorias").obtenerTodos();
    setCategorias(new Map(cats.map((c) => [c.id, c])));
    if (!db) { setCargando(false); return; }
    getDocs(collection(db, "actividades")).then((snap) => {
      setActividades(snap.docs.map((d) => d.data() as Actividad).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)));
      setCargando(false);
    });
  }, []);

  const toggleEstado = async (act: Actividad) => {
    if (!db) return;
    const nuevoEstado = act.estado === EstadoActividad.PUBLICADA ? EstadoActividad.DESPUBLICADA : EstadoActividad.PUBLICADA;
    await updateDoc(doc(db, "actividades", act.id), { estado: nuevoEstado });
    setActividades((prev) => prev.map((a) => a.id === act.id ? { ...a, estado: nuevoEstado } : a));
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta actividad?")) return;
    if (!db) return;
    await deleteDoc(doc(db, "actividades", id));
    setActividades((prev) => prev.filter((a) => a.id !== id));
  };

  if (cargando) {
    return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

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
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((act) => (
              <tr key={act.id} className="border-b border-slate-50 hover:bg-arena-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">{act.nombre}</td>
                <td className="px-4 py-3 text-slate-500">{categorias.get(act.categoriaId)?.nombre ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{act.proveedorId ? act.proveedorId.slice(0, 8) + "..." : "Admin"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleEstado(act)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      act.estado === EstadoActividad.PUBLICADA ? "bg-selva-100 text-selva-700"
                      : act.estado === EstadoActividad.PAUSADA ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {act.estado}
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
          <p className="p-8 text-center text-slate-400">No hay actividades en Firestore</p>
        )}
      </div>
    </div>
  );
}
