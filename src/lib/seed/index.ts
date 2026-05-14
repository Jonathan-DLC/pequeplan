import { LocalStorageRepository } from "../repositories";
import { Actividad, Categoria, RangoEdad, Zona } from "../models";
import { categorias } from "./categorias";
import { rangosEdad } from "./rangosEdad";
import { zonas } from "./zonas";
import { actividades } from "./actividades";

const SEED_KEY = "pequeplan-seeded";

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_KEY)) return;

  const repoCat = new LocalStorageRepository<Categoria>("categorias");
  const repoEdad = new LocalStorageRepository<RangoEdad>("rangos-edad");
  const repoZona = new LocalStorageRepository<Zona>("zonas");
  const repoAct = new LocalStorageRepository<Actividad>("actividades");

  categorias.forEach((c) => repoCat.guardar(c));
  rangosEdad.forEach((r) => repoEdad.guardar(r));
  zonas.forEach((z) => repoZona.guardar(z));
  actividades.forEach((a) => repoAct.guardar(a));

  localStorage.setItem(SEED_KEY, "true");
}
