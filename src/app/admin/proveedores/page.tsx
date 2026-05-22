"use client";

import { useEffect, useState } from "react";
import { ProveedorService } from "@/lib/services";
import { Proveedor } from "@/lib/models";

export default function AdminProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    new ProveedorService().listarTodos().then((p) => {
      setProveedores(p.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)));
      setCargando(false);
    });
  }, []);

  const aprobar = async (id: string) => {
    await new ProveedorService().aprobar(id);
    setProveedores((prev) => prev.map((p) => p.id === id ? { ...p, aprobado: true } : p));
  };

  const revocar = async (id: string) => {
    await new ProveedorService().rechazar(id);
    setProveedores((prev) => prev.map((p) => p.id === id ? { ...p, aprobado: false } : p));
  };

  const verificar = async (id: string) => {
    await new ProveedorService().verificar(id);
    setProveedores((prev) => prev.map((p) => p.id === id ? { ...p, verificado: true } : p));
  };

  const quitarVerif = async (id: string) => {
    await new ProveedorService().quitarVerificacion(id);
    setProveedores((prev) => prev.map((p) => p.id === id ? { ...p, verificado: false } : p));
  };

  if (cargando) {
    return <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">🏪 Proveedores</h1>

      {proveedores.length === 0 ? (
        <p className="text-sm text-slate-500">No hay proveedores registrados.</p>
      ) : (
        <div className="space-y-3">
          {proveedores.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-slate-700">{p.nombreNegocio}</p>
                <p className="text-xs text-slate-500">{p.email} · {p.telefono}</p>
                <p className="text-xs text-slate-400">{new Date(p.creadoEn).toLocaleDateString("es-CO")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  p.aprobado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {p.aprobado ? "Aprobado" : "Pendiente"}
                </span>
                {p.verificado && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">✓ Verificado</span>}
                {!p.aprobado ? (
                  <button onClick={() => aprobar(p.id)} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200">
                    ✓ Aprobar
                  </button>
                ) : (
                  <>
                    <button onClick={() => revocar(p.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                      ✗ Revocar
                    </button>
                    {!p.verificado ? (
                      <button onClick={() => verificar(p.id)} className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200">
                        🛡️ Verificar
                      </button>
                    ) : (
                      <button onClick={() => quitarVerif(p.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                        Quitar ✓
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
