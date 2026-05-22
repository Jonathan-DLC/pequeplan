import { LocalStorageRepository } from "../repositories";
import { Categoria, RangoEdad, Zona } from "../models";
import { categorias } from "./categorias";
import { rangosEdad } from "./rangosEdad";
import { zonas } from "./zonas";

const SEED_KEY = "pequeplan-seeded";

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_KEY)) return;

  const repoCat = new LocalStorageRepository<Categoria>("categorias");
  const repoEdad = new LocalStorageRepository<RangoEdad>("rangos-edad");
  const repoZona = new LocalStorageRepository<Zona>("zonas");

  categorias.forEach((c) => repoCat.guardar(c));
  rangosEdad.forEach((r) => repoEdad.guardar(r));
  zonas.forEach((z) => repoZona.guardar(z));

  localStorage.setItem(SEED_KEY, "true");
}
