"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ResenaService, ReporteService, ProveedorService } from "@/lib/services";
import { Resena } from "@/lib/models";

interface Props {
  actividadId: string;
  proveedorId: string | null;
}

export function SeccionResenas({ actividadId, proveedorId }: Props) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [esProveedor, setEsProveedor] = useState(false);
  const [respuestaId, setRespuestaId] = useState<string | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    new ResenaService().listarPorActividad(actividadId).then(setResenas);
    if (user && proveedorId) {
      new ProveedorService().obtenerPorUid(user.uid).then((p) => {
        if (p && p.id === proveedorId) setEsProveedor(true);
      });
    }
  }, [actividadId, user, proveedorId]);

  const enviar = async () => {
    if (!user || !comentario.trim()) return;
    setEnviando(true);
    const nueva = await new ResenaService().crear({
      actividadId, uid: user.uid, nombreUsuario: user.displayName || "Anónimo", estrellas, comentario: comentario.trim(),
    });
    setResenas([nueva, ...resenas]);
    setComentario("");
    setEstrellas(5);
    setEnviando(false);
  };

  const responder = async (id: string) => {
    if (!respuestaTexto.trim()) return;
    await new ResenaService().responder(id, respuestaTexto.trim());
    setResenas((prev) => prev.map((r) => r.id === id ? { ...r, respuestaProveedor: respuestaTexto.trim() } : r));
    setRespuestaId(null);
    setRespuestaTexto("");
  };

  const reportar = async (resenaId: string) => {
    if (!user) return;
    await new ReporteService().crear({ tipo: "resena", referenciaId: resenaId, uid: user.uid, motivo: "Contenido inapropiado" });
    setToast("Reporte enviado");
    setTimeout(() => setToast(""), 2000);
  };

  const promedio = resenas.length > 0 ? (resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length).toFixed(1) : null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700">Reseñas</h2>
        {promedio && <span className="text-sm text-yellow-600 font-semibold">⭐ {promedio} ({resenas.length})</span>}
      </div>

      {toast && <p className="text-xs text-green-600 mb-3">{toast}</p>}

      {/* Formulario */}
      {user && (
        <div className="mb-6 border-b border-slate-100 pb-5">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setEstrellas(n)} className={`text-xl ${n <= estrellas ? "text-yellow-400" : "text-slate-200"}`}>★</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu reseña..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400"
            />
            <button onClick={enviar} disabled={enviando || !comentario.trim()} className="rounded-xl bg-caribe-500 px-4 py-2 text-xs font-semibold text-white hover:bg-caribe-600 disabled:opacity-50">
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {resenas.length === 0 ? (
        <p className="text-sm text-slate-400">Sin reseñas aún. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4">
          {resenas.map((r) => (
            <div key={r.id} className="border-b border-slate-50 pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-500">{"★".repeat(r.estrellas)}{"☆".repeat(5 - r.estrellas)}</span>
                  <span className="text-xs font-medium text-slate-600">{r.nombreUsuario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{new Date(r.creadoEn).toLocaleDateString("es-CO")}</span>
                  {user && (
                    <button onClick={() => reportar(r.id)} className="text-xs text-slate-400 hover:text-red-500" title="Reportar">🚩</button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.comentario}</p>
              {r.respuestaProveedor && (
                <div className="mt-2 ml-4 rounded-lg bg-caribe-50 p-2 text-xs text-slate-600">
                  <span className="font-semibold text-caribe-700">Respuesta del proveedor:</span> {r.respuestaProveedor}
                </div>
              )}
              {esProveedor && !r.respuestaProveedor && (
                respuestaId === r.id ? (
                  <div className="mt-2 ml-4 flex gap-2">
                    <input value={respuestaTexto} onChange={(e) => setRespuestaTexto(e.target.value)} placeholder="Tu respuesta..." className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs" />
                    <button onClick={() => responder(r.id)} className="rounded-lg bg-caribe-500 px-3 py-1 text-xs text-white">Enviar</button>
                    <button onClick={() => setRespuestaId(null)} className="text-xs text-slate-400">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setRespuestaId(r.id)} className="mt-1 ml-4 text-xs text-caribe-600 hover:underline">Responder</button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
