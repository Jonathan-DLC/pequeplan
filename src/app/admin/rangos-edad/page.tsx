"use client";

import { useEffect, useState } from "react";
import { LocalStorageRepository } from "@/lib/repositories";
import { RangoEdad } from "@/lib/models";

const repo = new LocalStorageRepository<RangoEdad>("rangos-edad");

export default function AdminRangosEdad() {
  const [rangos, setRangos] = useState<RangoEdad[]>([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [edadMin, setEdadMin] = useState("");
  const [edadMax, setEdadMax] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const cargar = () => setRangos(repo.obtenerTodos());
  useEffect(cargar, []);

  const guardar = () => {
    const min = Number(edadMin); const max = Number(edadMax);
    if (!etiqueta.trim() || !min || !max || min >= max) { alert("Verifica los campos (min < max)"); return; }
    if (editId) {
      repo.guardar({ id: editId, etiqueta, edadMin: min, edadMax: max });
    } else {
      repo.guardar({ id: crypto.randomUUID(), etiqueta, edadMin: min, edadMax: max });
    }
    setEtiqueta(""); setEdadMin(""); setEdadMax(""); setEditId(null);
    cargar();
  };

  const editar = (r: RangoEdad) => {
    setEditId(r.id); setEtiqueta(r.etiqueta); setEdadMin(r.edadMin.toString()); setEdadMax(r.edadMax.toString());
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar este rango de edad?")) return;
    repo.eliminar(id);
    cargar();
  };

  const cancelar = () => { setEditId(null); setEtiqueta(""); setEdadMin(""); setEdadMax(""); };

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400";

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">Rangos de Edad</h1>

      {/* Formulario */}
      <div className="rounded-2xl bg-white p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">{editId ? "Editar rango" : "Nuevo rango"}</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[120px]">
            <input placeholder="Etiqueta (ej: 4-6 años) *" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} className={input} />
          </div>
          <div className="w-24">
            <input placeholder="Edad mín" type="number" value={edadMin} onChange={(e) => setEdadMin(e.target.value)} className={input} />
          </div>
          <div className="w-24">
            <input placeholder="Edad máx" type="number" value={edadMax} onChange={(e) => setEdadMax(e.target.value)} className={input} />
          </div>
          <button onClick={guardar} className="rounded-xl bg-caribe-500 px-4 py-2 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            {editId ? "Actualizar" : "Agregar"}
          </button>
          {editId && <button onClick={cancelar} className="text-sm text-slate-500 hover:underline">Cancelar</button>}
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {rangos.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 hover:bg-arena-50 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-slate-700 text-sm">{r.etiqueta}</p>
              <p className="text-xs text-slate-400">{r.edadMin} — {r.edadMax} años</p>
            </div>
            <button onClick={() => editar(r)} className="text-xs text-caribe-600 hover:underline">Editar</button>
            <button onClick={() => eliminar(r.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
        {rangos.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No hay rangos de edad</p>}
      </div>
    </div>
  );
}
