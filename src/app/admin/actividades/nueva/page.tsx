"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogoAdminService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Categoria, DiaSemana, EstadoActividad, Horario, Moneda, RangoEdad, Zona } from "@/lib/models";

export default function NuevaActividad() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [rangos, setRangos] = useState<RangoEdad[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [rangoEdadId, setRangoEdadId] = useState("");
  const [zonaId, setZonaId] = useState("");
  const [esGratuita, setEsGratuita] = useState(false);
  const [precioDesde, setPrecioDesde] = useState("");
  const [precioHasta, setPrecioHasta] = useState("");
  const [horarios, setHorarios] = useState<Horario[]>([{ diaSemana: DiaSemana.LUNES, horaInicio: "14:00", horaFin: "15:00" }]);
  const [telefono, setTelefono] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    setCategorias(new LocalStorageRepository<Categoria>("categorias").obtenerTodos());
    setRangos(new LocalStorageRepository<RangoEdad>("rangos-edad").obtenerTodos());
    setZonas(new LocalStorageRepository<Zona>("zonas").obtenerTodos());
  }, []);

  const addHorario = () => setHorarios([...horarios, { diaSemana: DiaSemana.LUNES, horaInicio: "14:00", horaFin: "15:00" }]);
  const removeHorario = (i: number) => setHorarios(horarios.filter((_, idx) => idx !== i));
  const updateHorario = (i: number, field: keyof Horario, value: string) => {
    const copy = [...horarios];
    copy[i] = { ...copy[i], [field]: value };
    setHorarios(copy);
  };

  const guardar = () => {
    if (!nombre || !categoriaId || !rangoEdadId || !zonaId) { alert("Completa los campos obligatorios"); return; }
    new CatalogoAdminService().crear({
      nombre, descripcion, categoriaId, rangoEdadId, zonaId,
      esGratuita,
      precioDesde: esGratuita ? null : Number(precioDesde) || null,
      precioHasta: esGratuita ? null : Number(precioHasta) || null,
      moneda: esGratuita ? null : Moneda.COP,
      estado: EstadoActividad.PUBLICADA,
      imagenUrl: null,
      latitud: null,
      longitud: null,
      proveedorId: null,
      cuposDisponibles: null,
      destacada: false,
      horarios,
      contacto: {
        telefono: telefono || null, whatsapp: whatsapp || null, email: email || null,
        direccion: direccion || null, sitioWeb: sitioWeb || null, instagram: instagram || null,
      },
    });
    router.push("/admin");
  };

  const input = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-caribe-400";
  const label = "block text-xs font-semibold text-slate-500 uppercase mb-1";

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-800 mb-6">Nueva Actividad</h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className={label}>Nombre *</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={input} />
        </div>
        <div>
          <label className={label}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={input} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Categoría *</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={input}>
              <option value="">Seleccionar</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Rango de edad *</label>
            <select value={rangoEdadId} onChange={(e) => setRangoEdadId(e.target.value)} className={input}>
              <option value="">Seleccionar</option>
              {rangos.map((r) => <option key={r.id} value={r.id}>{r.etiqueta}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Zona *</label>
            <select value={zonaId} onChange={(e) => setZonaId(e.target.value)} className={input}>
              <option value="">Seleccionar</option>
              {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={esGratuita} onChange={(e) => setEsGratuita(e.target.checked)} className="rounded" />
            Actividad gratuita
          </label>
          {!esGratuita && (
            <>
              <input placeholder="Precio desde" value={precioDesde} onChange={(e) => setPrecioDesde(e.target.value)} className={`${input} w-32`} type="number" />
              <input placeholder="Precio hasta" value={precioHasta} onChange={(e) => setPrecioHasta(e.target.value)} className={`${input} w-32`} type="number" />
            </>
          )}
        </div>

        {/* Horarios */}
        <div>
          <label className={label}>Horarios</label>
          {horarios.map((h, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <select value={h.diaSemana} onChange={(e) => updateHorario(i, "diaSemana", e.target.value)} className={`${input} w-36`}>
                {Object.values(DiaSemana).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="time" value={h.horaInicio} onChange={(e) => updateHorario(i, "horaInicio", e.target.value)} className={`${input} w-28`} />
              <input type="time" value={h.horaFin} onChange={(e) => updateHorario(i, "horaFin", e.target.value)} className={`${input} w-28`} />
              <button onClick={() => removeHorario(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
            </div>
          ))}
          <button onClick={addHorario} className="text-sm text-caribe-600 hover:underline">+ Agregar horario</button>
        </div>

        {/* Contacto */}
        <div>
          <label className={label}>Contacto</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={input} />
            <input placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={input} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            <input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={input} />
            <input placeholder="Sitio web" value={sitioWeb} onChange={(e) => setSitioWeb(e.target.value)} className={input} />
            <input placeholder="Instagram (@usuario)" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={input} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={guardar} className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            Guardar actividad
          </button>
          <button onClick={() => router.push("/admin")} className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
