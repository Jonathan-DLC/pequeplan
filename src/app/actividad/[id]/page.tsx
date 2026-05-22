"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { BuscadorService, CompartirService, FavoritosService, ReservaService, ReporteService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, RangoEdad, Zona } from "@/lib/models";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { SeccionResenas } from "@/components/SeccionResenas";

export default function DetalleActividad() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [rango, setRango] = useState<RangoEdad | null>(null);
  const [zona, setZona] = useState<Zona | null>(null);
  const [esFav, setEsFav] = useState(false);
  const [toast, setToast] = useState("");
  const [showInscribir, setShowInscribir] = useState(false);
  const [nombreNino, setNombreNino] = useState("");
  const [edadNino, setEdadNino] = useState("");
  const [nombrePadre, setNombrePadre] = useState("");
  const [telefonoPadre, setTelefonoPadre] = useState("");
  const [inscribiendo, setInscribiendo] = useState(false);
  const [cuposRestantes, setCuposRestantes] = useState<number | null>(null);
  const [showReportar, setShowReportar] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState("");

  useEffect(() => {
    const loadActivity = async () => {
      const svc = new BuscadorService();
      let act = svc.verDetalle(id);
      // Fallback to Firestore for provider-created activities
      if (!act && db) {
        const snap = await getDoc(doc(db, "actividades", id));
        if (snap.exists()) act = snap.data() as Actividad;
      }
      if (!act) { router.push("/"); return; }
      setActividad(act);
      setCategoria(new LocalStorageRepository<Categoria>("categorias").obtenerPorId(act.categoriaId));
      setRango(new LocalStorageRepository<RangoEdad>("rangos-edad").obtenerPorId(act.rangoEdadId));
      setZona(new LocalStorageRepository<Zona>("zonas").obtenerPorId(act.zonaId));
      setEsFav(new FavoritosService(user?.uid).esFavoritaLocal(act.id));
      if (act.cuposDisponibles != null) {
        new ReservaService().contarConfirmadasPorActividad(act.id).then((count) => {
          setCuposRestantes(act!.cuposDisponibles! - count);
        });
      }
    };
    loadActivity();
  }, [id, router, user]);

  const toggleFav = useCallback(async () => {
    if (!actividad) return;
    const svc = new FavoritosService(user?.uid);
    if (esFav) { await svc.quitar(actividad.id); } else { await svc.agregar(actividad.id); }
    setEsFav(!esFav);
    setToast(esFav ? "Eliminada de favoritas" : "¡Guardada en favoritas!");
    setTimeout(() => setToast(""), 2000);
  }, [actividad, esFav, user]);

  const compartir = useCallback(async () => {
    if (!actividad) return;
    const result = await new CompartirService().compartir(actividad);
    setToast(result === "shared" ? "¡Compartido!" : "Enlace copiado al portapapeles");
    setTimeout(() => setToast(""), 2000);
  }, [actividad]);

  if (!actividad) return null;

  const reportarActividad = async () => {
    if (!user || !actividad || !motivoReporte) return;
    await new ReporteService().crear({ tipo: "actividad", referenciaId: actividad.id, uid: user.uid, motivo: motivoReporte });
    setShowReportar(false);
    setMotivoReporte("");
    setToast("Reporte enviado. Gracias por tu feedback.");
    setTimeout(() => setToast(""), 3000);
  };

  const inscribir = async () => {
    if (!user || !actividad || !nombreNino.trim() || !nombrePadre.trim() || !telefonoPadre.trim()) return;
    setInscribiendo(true);
    await new ReservaService().preinscribir(
      actividad.id, user.uid,
      { nombreNino: nombreNino.trim(), edadNino: Number(edadNino) || 0, nombrePadre: nombrePadre.trim(), telefonoPadre: telefonoPadre.trim() },
      actividad.proveedorId, actividad.precioDesde, actividad.esGratuita
    );
    setShowInscribir(false);
    setNombreNino(""); setEdadNino(""); setNombrePadre(""); setTelefonoPadre("");
    setInscribiendo(false);
    if (cuposRestantes != null) setCuposRestantes(cuposRestantes - 1);
    setToast("¡Solicitud enviada! El proveedor revisará tu inscripción.");
    setTimeout(() => setToast(""), 3000);
  };

  const dias: Record<string, string> = { LUNES: "Lunes", MARTES: "Martes", MIERCOLES: "Miércoles", JUEVES: "Jueves", VIERNES: "Viernes", SABADO: "Sábado", DOMINGO: "Domingo" };

  const mapsUrl = actividad.latitud && actividad.longitud
    ? `https://www.google.com/maps?q=${actividad.latitud},${actividad.longitud}`
    : actividad.contacto.direccion
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(actividad.contacto.direccion)}`
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {toast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-selva-500 px-4 py-2 text-sm font-medium text-white shadow-lg animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}

      <Link href="/" className="inline-flex items-center gap-1 text-sm text-caribe-600 hover:text-caribe-800 mb-6 transition-colors">
        ← Volver al catálogo
      </Link>

      {/* Hero */}
      <div
        className="rounded-3xl p-8 mb-8"
        style={{ background: `linear-gradient(135deg, ${categoria?.color ?? "#06b6d4"}22, ${categoria?.color ?? "#06b6d4"}08)` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {categoria && (
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white mb-3" style={{ backgroundColor: categoria.color ?? "#6b7280" }}>
                {categoria.nombre}
              </span>
            )}
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-slate-800 md:text-4xl">
              {actividad.nombre}
            </h1>
          </div>
          <span className="text-2xl font-bold text-coral-600">
            {actividad.esGratuita ? "Gratis" : `$${(actividad.precioDesde ?? 0).toLocaleString("es-CO")}${actividad.precioHasta ? ` - $${actividad.precioHasta.toLocaleString("es-CO")}` : ""}`}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={toggleFav}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${esFav ? "bg-coral-500 text-white" : "bg-white text-coral-500 border border-coral-200 hover:bg-coral-50"}`}
          >
            {esFav ? "❤️ Guardada" : "🤍 Guardar favorita"}
          </button>
          <button
            onClick={compartir}
            className="rounded-xl bg-white border border-caribe-200 px-4 py-2 text-sm font-semibold text-caribe-600 hover:bg-caribe-50 transition-all"
          >
            🔗 Compartir
          </button>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white border border-selva-200 px-4 py-2 text-sm font-semibold text-selva-600 hover:bg-selva-50 transition-all"
            >
              📍 Ver en Google Maps
            </a>
          )}
          {user && cuposRestantes !== 0 && (
            <button
              onClick={() => setShowInscribir(true)}
              className="rounded-xl bg-selva-500 px-4 py-2 text-sm font-semibold text-white hover:bg-selva-600 transition-all"
            >
              📝 Solicitar inscripción {cuposRestantes != null && `(${cuposRestantes} cupos)`}
            </button>
          )}
          {cuposRestantes === 0 && (
            <span className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Sin cupos</span>
          )}
          {user && (
            <button
              onClick={() => setShowReportar(true)}
              className="rounded-xl bg-white border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              🚩 Reportar
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Descripción</h2>
            <p className="text-slate-600 leading-relaxed">{actividad.descripcion}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-slate-700 mb-3">Horarios</h2>
            <div className="space-y-2">
              {actividad.horarios.map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-caribe-50 px-4 py-2 text-sm">
                  <span className="font-medium text-caribe-700">{dias[h.diaSemana]}</span>
                  <span className="text-slate-600">{h.horaInicio} — {h.horaFin}</span>
                </div>
              ))}
            </div>
          </section>

          <SeccionResenas actividadId={actividad.id} proveedorId={actividad.proveedorId} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            {zona && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Zona</p>
                <p className="text-sm text-slate-700">📍 {zona.nombre}</p>
              </div>
            )}
            {rango && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Edad</p>
                <p className="text-sm text-slate-700">👶 {rango.etiqueta}</p>
              </div>
            )}
            {actividad.moneda && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Moneda</p>
                <p className="text-sm text-slate-700">💰 {actividad.moneda}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-slate-700">Contacto</h3>
            {actividad.contacto.direccion && <p className="text-sm text-slate-600">📍 {actividad.contacto.direccion}</p>}
            {actividad.contacto.telefono && <p className="text-sm"><a href={`tel:${actividad.contacto.telefono}`} className="text-caribe-600 hover:underline">📞 {actividad.contacto.telefono}</a></p>}
            {actividad.contacto.whatsapp && <p className="text-sm"><a href={`https://wa.me/57${actividad.contacto.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-selva-600 hover:underline">💬 WhatsApp</a></p>}
            {actividad.contacto.email && <p className="text-sm"><a href={`mailto:${actividad.contacto.email}`} className="text-caribe-600 hover:underline">✉️ {actividad.contacto.email}</a></p>}
            {actividad.contacto.sitioWeb && <p className="text-sm"><a href={actividad.contacto.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-caribe-600 hover:underline">🌐 Sitio web</a></p>}
            {actividad.contacto.instagram && <p className="text-sm"><a href={`https://instagram.com/${actividad.contacto.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-coral-500 hover:underline">📸 {actividad.contacto.instagram}</a></p>}
          </div>
        </aside>
      </div>

      {/* Modal reportar */}
      {showReportar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-white p-6 shadow-xl w-full max-w-sm mx-4">
            <h3 className="font-bold text-lg text-slate-700 mb-4">🚩 Reportar actividad</h3>
            <div className="space-y-2 mb-4">
              {["Información falsa", "Contenido inapropiado", "Actividad no existe", "Spam o publicidad engañosa", "Otro"].map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="radio" name="motivo" value={m} checked={motivoReporte === m} onChange={(e) => setMotivoReporte(e.target.value)} className="accent-red-500" />
                  {m}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={reportarActividad} disabled={!motivoReporte} className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50">
                Enviar reporte
              </button>
              <button onClick={() => { setShowReportar(false); setMotivoReporte(""); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal inscripción */}
      {showInscribir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-white p-6 shadow-xl w-full max-w-sm mx-4">
            <h3 className="font-bold text-lg text-slate-700 mb-4">Inscribir niño</h3>
            <div className="space-y-3">
              <input
                placeholder="Nombre del niño *"
                value={nombreNino}
                onChange={(e) => setNombreNino(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400"
              />
              <input
                placeholder="Edad del niño"
                value={edadNino}
                onChange={(e) => setEdadNino(e.target.value)}
                type="number"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400"
              />
              <input
                placeholder="Nombre del padre/tutor *"
                value={nombrePadre}
                onChange={(e) => setNombrePadre(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400"
              />
              <input
                placeholder="Teléfono de contacto *"
                value={telefonoPadre}
                onChange={(e) => setTelefonoPadre(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={inscribir} disabled={inscribiendo || !nombreNino.trim() || !nombrePadre.trim() || !telefonoPadre.trim()} className="flex-1 rounded-xl bg-selva-500 px-4 py-2 text-sm font-semibold text-white hover:bg-selva-600 disabled:opacity-50">
                {inscribiendo ? "Inscribiendo..." : "Confirmar"}
              </button>
              <button onClick={() => setShowInscribir(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
