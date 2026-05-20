"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProveedorService, SuscripcionService, PLANES } from "@/lib/services";
import { Proveedor, Suscripcion } from "@/lib/models";

export default function PlanesProveedor() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [subActiva, setSubActiva] = useState<Suscripcion | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    new ProveedorService().obtenerPorUid(user.uid).then((p) => {
      if (!p) { router.push("/proveedor/registro"); return; }
      setProveedor(p);
      new SuscripcionService().obtenerActiva(p.id).then(setSubActiva);
    });
  }, [user, loading, router]);

  const pagar = async (plan: "BASICO" | "PREMIUM") => {
    if (!proveedor) return;
    setProcesando(plan);
    // Simula delay de pasarela
    await new Promise((r) => setTimeout(r, 1500));
    await new SuscripcionService().suscribir(proveedor.id, plan);
    setProcesando(null);
    setExito(true);
    setTimeout(() => router.push("/proveedor"), 2000);
  };

  if (loading || !proveedor) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" /></div>;
  }

  if (exito) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-xl font-bold text-selva-600">¡Pago exitoso!</h1>
        <p className="text-sm text-slate-500 mt-2">Tu suscripción ha sido activada.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-700 mb-2">Planes de Suscripción</h1>
      <p className="text-sm text-slate-500 mb-8">Elige un plan para destacar tus actividades y reducir comisiones</p>

      {subActiva && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 mb-6 text-sm text-green-800">
          ✅ Tienes plan <strong>{PLANES[subActiva.plan].nombre}</strong> activo hasta {new Date(subActiva.fechaFin).toLocaleDateString("es-CO")}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {(Object.entries(PLANES) as [keyof typeof PLANES, typeof PLANES[keyof typeof PLANES]][]).map(([key, plan]) => (
          <div key={key} className={`rounded-3xl p-6 shadow-sm border-2 ${key === "PREMIUM" ? "border-caribe-400 bg-caribe-50" : "border-slate-200 bg-white"}`}>
            {key === "PREMIUM" && <span className="inline-block rounded-full bg-caribe-500 px-3 py-0.5 text-xs font-bold text-white mb-3">Recomendado</span>}
            <h2 className="text-xl font-bold text-slate-800">{plan.nombre}</h2>
            <p className="text-3xl font-bold text-caribe-600 mt-2">${plan.precio.toLocaleString("es-CO")} <span className="text-sm font-normal text-slate-400">/mes</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✓ Publicar actividades</li>
              <li>✓ Comisión del {plan.comision}% por reserva</li>
              {key === "PREMIUM" && <li>✓ Actividades destacadas en el catálogo</li>}
              {key === "PREMIUM" && <li>✓ Badge de proveedor premium</li>}
            </ul>
            <button
              onClick={() => pagar(key)}
              disabled={procesando !== null || (subActiva?.plan === key)}
              className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                key === "PREMIUM" ? "bg-caribe-500 text-white hover:bg-caribe-600" : "bg-slate-800 text-white hover:bg-slate-900"
              }`}
            >
              {procesando === key ? "Procesando pago..." : subActiva?.plan === key ? "Plan actual" : "Suscribirse"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">💡 Pago simulado — no se realizará ningún cobro real</p>
    </div>
  );
}
