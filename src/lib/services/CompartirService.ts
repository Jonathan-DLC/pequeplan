import { Actividad } from "../models";

export class CompartirService {
  generarEnlace(actividad: Actividad): string {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/actividad/${actividad.id}`;
  }

  generarTextoPlano(actividad: Actividad): string {
    return `${actividad.nombre} — ${actividad.descripcion.slice(0, 100)}...`;
  }

  async compartir(actividad: Actividad): Promise<"shared" | "copied"> {
    const url = this.generarEnlace(actividad);
    const text = this.generarTextoPlano(actividad);

    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: actividad.nombre, text, url });
      return "shared";
    }

    await navigator.clipboard.writeText(url);
    return "copied";
  }
}
