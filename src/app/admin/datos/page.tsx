"use client";

import { useRef, useState } from "react";
import { ImportExportService } from "@/lib/services";
import { FormatoArchivo, ModoImport } from "@/lib/models";

export default function AdminDatos() {
  const svc = new ImportExportService();
  const fileRef = useRef<HTMLInputElement>(null);
  const [modo, setModo] = useState<ModoImport>(ModoImport.FUSIONAR);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  const exportar = (formato: FormatoArchivo) => {
    svc.exportar(formato);
    setMensaje({ ok: true, texto: `Archivo ${formato} descargado` });
    setTimeout(() => setMensaje(null), 3000);
  };

  const importar = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setMensaje({ ok: false, texto: "Selecciona un archivo" }); return; }
    const result = await svc.importar(file, modo);
    setMensaje({ ok: result.ok, texto: result.mensaje });
    if (result.ok && fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">Import / Export</h1>

      {mensaje && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${mensaje.ok ? "bg-selva-100 text-selva-700" : "bg-red-50 text-red-600"}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Exportar */}
      <section className="rounded-2xl bg-white p-6 shadow-sm mb-6">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Exportar catálogo</h2>
        <p className="text-sm text-slate-500 mb-4">Descarga todo el catálogo (actividades, categorías, rangos y zonas)</p>
        <div className="flex gap-3">
          <button onClick={() => exportar(FormatoArchivo.JSON)} className="rounded-xl bg-caribe-500 px-4 py-2 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            📥 Exportar JSON
          </button>
          <button onClick={() => exportar(FormatoArchivo.CSV)} className="rounded-xl border border-caribe-200 px-4 py-2 text-sm font-semibold text-caribe-600 hover:bg-caribe-50 transition-colors">
            📥 Exportar CSV
          </button>
        </div>
      </section>

      {/* Importar */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Importar catálogo</h2>
        <p className="text-sm text-slate-500 mb-4">Sube un archivo JSON previamente exportado</p>

        <div className="space-y-4">
          <input ref={fileRef} type="file" accept=".json" className="block text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-caribe-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-caribe-600 hover:file:bg-caribe-100" />

          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-600">Modo:</label>
            <label className="flex items-center gap-1.5 text-sm">
              <input type="radio" name="modo" checked={modo === ModoImport.FUSIONAR} onChange={() => setModo(ModoImport.FUSIONAR)} />
              Fusionar (agrega sin borrar)
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <input type="radio" name="modo" checked={modo === ModoImport.REEMPLAZAR} onChange={() => setModo(ModoImport.REEMPLAZAR)} />
              Reemplazar (borra todo primero)
            </label>
          </div>

          <button onClick={importar} className="rounded-xl bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600 transition-colors">
            📤 Importar archivo
          </button>
        </div>
      </section>
    </div>
  );
}
