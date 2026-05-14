import { LocalStorageRepository } from "../repositories";
import { Actividad, Categoria, FormatoArchivo, ModoImport, RangoEdad, Zona } from "../models";

interface DatosCatalogo {
  actividades: Actividad[];
  categorias: Categoria[];
  rangosEdad: RangoEdad[];
  zonas: Zona[];
}

export class ImportExportService {
  private repoAct = new LocalStorageRepository<Actividad>("actividades");
  private repoCat = new LocalStorageRepository<Categoria>("categorias");
  private repoEdad = new LocalStorageRepository<RangoEdad>("rangos-edad");
  private repoZona = new LocalStorageRepository<Zona>("zonas");

  exportar(formato: FormatoArchivo): void {
    const datos: DatosCatalogo = {
      actividades: this.repoAct.obtenerTodos(),
      categorias: this.repoCat.obtenerTodos(),
      rangosEdad: this.repoEdad.obtenerTodos(),
      zonas: this.repoZona.obtenerTodos(),
    };

    let contenido: string;
    let tipo: string;
    let ext: string;

    if (formato === FormatoArchivo.JSON) {
      contenido = JSON.stringify(datos, null, 2);
      tipo = "application/json";
      ext = "json";
    } else {
      contenido = this.generarCsv(datos.actividades);
      tipo = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pequeplan-catalogo.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importar(archivo: File, modo: ModoImport): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const texto = await archivo.text();
      let datos: DatosCatalogo;

      if (archivo.name.endsWith(".json")) {
        datos = JSON.parse(texto);
      } else {
        return { ok: false, mensaje: "Solo se soporta importación de archivos JSON" };
      }

      if (!datos.actividades || !datos.categorias || !datos.rangosEdad || !datos.zonas) {
        return { ok: false, mensaje: "El archivo no tiene la estructura esperada" };
      }

      if (modo === ModoImport.REEMPLAZAR) {
        this.repoAct.limpiar();
        this.repoCat.limpiar();
        this.repoEdad.limpiar();
        this.repoZona.limpiar();
      }

      datos.categorias.forEach((c) => this.repoCat.guardar(c));
      datos.rangosEdad.forEach((r) => this.repoEdad.guardar(r));
      datos.zonas.forEach((z) => this.repoZona.guardar(z));
      datos.actividades.forEach((a) => this.repoAct.guardar(a));

      return { ok: true, mensaje: `Importadas ${datos.actividades.length} actividades, ${datos.categorias.length} categorías, ${datos.rangosEdad.length} rangos, ${datos.zonas.length} zonas` };
    } catch {
      return { ok: false, mensaje: "Error al leer el archivo. Verifica que sea un JSON válido." };
    }
  }

  private generarCsv(actividades: Actividad[]): string {
    const headers = ["id", "nombre", "descripcion", "categoriaId", "rangoEdadId", "zonaId", "esGratuita", "precioDesde", "precioHasta", "estado"];
    const rows = actividades.map((a) =>
      [a.id, `"${a.nombre}"`, `"${a.descripcion}"`, a.categoriaId, a.rangoEdadId, a.zonaId, a.esGratuita, a.precioDesde ?? "", a.precioHasta ?? "", a.estado].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }
}
