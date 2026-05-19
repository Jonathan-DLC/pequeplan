"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { FavoritosService } from "@/lib/services";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, Categoria, Zona } from "@/lib/models";
import { ActivityCard } from "@/components/ActivityCard";
import Link from "next/link";

export default function Favoritas() {
  const { user } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);

  useEffect(() => {
    const svc = new FavoritosService(user?.uid);
    svc.sincronizarDesdeFirestore().then(() => {
      setActividades(svc.listarLocal());
    });
    setCategorias(new LocalStorageRepository<Categoria>("categorias").obtenerTodos());
    setZonas(new LocalStorageRepository<Zona>("zonas").obtenerTodos());
  }, [user]);

  const catMap = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
  const zonaMap = useMemo(() => new Map(zonas.map((z) => [z.id, z])), [zonas]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-caribe-700 mb-8">
        ❤️ Mis Favoritas
      </h1>

      {actividades.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">💫</p>
          <p className="text-lg font-semibold text-slate-700">¡Aún no tienes favoritas!</p>
          <p className="mt-2 text-sm text-slate-500">Explora el catálogo y guarda las actividades que más te gusten</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {actividades.map((act) => (
            <ActivityCard
              key={act.id}
              actividad={act}
              categoria={catMap.get(act.categoriaId)}
              zona={zonaMap.get(act.zonaId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
