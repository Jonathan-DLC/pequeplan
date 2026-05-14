"use client";

import { useEffect, useState } from "react";
import { LocalStorageRepository } from "@/lib/repositories";
import { Categoria } from "@/lib/models";

const repo = new LocalStorageRepository<Categoria>("categorias");

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [color, setColor] = useState("#06b6d4");
  const [editId, setEditId] = useState<string | null>(null);

  const cargar = () => setCategorias(repo.obtenerTodos());
  useEffect(cargar, []);

  const guardar = () => {
    if (!nombre.trim()) return;
    if (editId) {
      repo.guardar({ id: editId, nombre, descripcion, color });
    } else {
      repo.guardar({ id: crypto.randomUUID(), nombre, descripcion, color });
    }
    setNombre(""); setDescripcion(""); setColor("#06b6d4"); setEditId(null);
    cargar();
  };

  const editar = (c: Categoria) => {
    setEditId(c.id); setNombre(c.nombre); setDescripcion(c.descripcion); setColor(c.color ?? "#06b6d4");
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    repo.eliminar(id);
    cargar();
  };

  const cancelar = () => { setEditId(null); setNombre(""); setDescripcion(""); setColor("#06b6d4"); };

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400";

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">Categorías</h1>

      {/* Formulario */}
      <div className="rounded-2xl bg-white p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">{editId ? "Editar categoría" : "Nueva categoría"}</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <input placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} className={input} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={input} />
          </div>
          <div className="w-20">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer" />
          </div>
          <button onClick={guardar} className="rounded-xl bg-caribe-500 px-4 py-2 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            {editId ? "Actualizar" : "Agregar"}
          </button>
          {editId && <button onClick={cancelar} className="text-sm text-slate-500 hover:underline">Cancelar</button>}
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {categorias.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 hover:bg-arena-50 transition-colors">
            <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: c.color ?? "#ccc" }} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-700 text-sm">{c.nombre}</p>
              <p className="text-xs text-slate-400 truncate">{c.descripcion}</p>
            </div>
            <button onClick={() => editar(c)} className="text-xs text-caribe-600 hover:underline">Editar</button>
            <button onClick={() => eliminar(c.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
        {categorias.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No hay categorías</p>}
      </div>
    </div>
  );
}
