import { describe, it, expect, beforeEach } from "vitest";
import { BuscadorService } from "@/lib/services/BuscadorService";
import { LocalStorageRepository } from "@/lib/repositories";
import { Actividad, CriterioOrden, DiaSemana, EstadoActividad, Moneda } from "@/lib/models";

function crearActividad(overrides: Partial<Actividad> = {}): Actividad {
  return {
    id: "test-1",
    nombre: "Actividad Test",
    descripcion: "Descripción de prueba",
    categoriaId: "cat-1",
    rangoEdadId: "edad-1",
    zonaId: "zona-1",
    esGratuita: false,
    precioDesde: 100000,
    precioHasta: 200000,
    moneda: Moneda.COP,
    estado: EstadoActividad.PUBLICADA,
    imagenUrl: null,
    horarios: [{ diaSemana: DiaSemana.LUNES, horaInicio: "14:00", horaFin: "15:00" }],
    contacto: { telefono: null, whatsapp: null, email: null, direccion: null, sitioWeb: null, instagram: null },
    creadoEn: "2026-01-01T00:00:00Z",
    actualizadoEn: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("BuscadorService", () => {
  let svc: BuscadorService;
  let repo: LocalStorageRepository<Actividad>;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRepository<Actividad>("actividades");
    svc = new BuscadorService();

    repo.guardar(crearActividad({ id: "1", nombre: "Natación Kids", precioDesde: 150000, categoriaId: "cat-1", zonaId: "zona-2", rangoEdadId: "edad-1" }));
    repo.guardar(crearActividad({ id: "2", nombre: "Taller de Pintura", precioDesde: 80000, categoriaId: "cat-2", zonaId: "zona-1", rangoEdadId: "edad-2", horarios: [{ diaSemana: DiaSemana.SABADO, horaInicio: "10:00", horaFin: "12:00" }] }));
    repo.guardar(crearActividad({ id: "3", nombre: "Robótica Avanzada", precioDesde: 200000, categoriaId: "cat-4", zonaId: "zona-2", rangoEdadId: "edad-3" }));
    repo.guardar(crearActividad({ id: "4", nombre: "Ballet Despublicado", estado: EstadoActividad.DESPUBLICADA }));
  });

  it("buscar() retorna solo actividades publicadas", () => {
    expect(svc.buscar()).toHaveLength(3);
  });

  it("buscarPorTexto() filtra por nombre", () => {
    expect(svc.buscarPorTexto("natación")).toHaveLength(1);
    expect(svc.buscarPorTexto("natación")[0].id).toBe("1");
  });

  it("buscarPorTexto() filtra por descripción", () => {
    expect(svc.buscarPorTexto("prueba")).toHaveLength(3);
  });

  it("filtrar() por categoría", () => {
    expect(svc.filtrar({ categoriaId: "cat-2" })).toHaveLength(1);
  });

  it("filtrar() por zona", () => {
    expect(svc.filtrar({ zonaId: "zona-2" })).toHaveLength(2);
  });

  it("filtrar() por rango de edad", () => {
    expect(svc.filtrar({ rangoEdadId: "edad-3" })).toHaveLength(1);
  });

  it("filtrar() por día de semana", () => {
    expect(svc.filtrar({ diaSemana: DiaSemana.SABADO })).toHaveLength(1);
    expect(svc.filtrar({ diaSemana: DiaSemana.LUNES })).toHaveLength(2);
  });

  it("filtrar() combinado", () => {
    expect(svc.filtrar({ zonaId: "zona-2", categoriaId: "cat-1" })).toHaveLength(1);
  });

  it("ordenar() por precio ascendente", () => {
    const resultado = svc.ordenar(svc.buscar(), CriterioOrden.PRECIO, true);
    expect(resultado[0].id).toBe("2");
    expect(resultado[2].id).toBe("3");
  });

  it("ordenar() por nombre descendente", () => {
    const resultado = svc.ordenar(svc.buscar(), CriterioOrden.NOMBRE, false);
    expect(resultado[0].nombre).toBe("Taller de Pintura");
  });

  it("verDetalle() retorna actividad publicada", () => {
    expect(svc.verDetalle("1")).not.toBeNull();
  });

  it("verDetalle() retorna null para despublicada", () => {
    expect(svc.verDetalle("4")).toBeNull();
  });

  it("verDetalle() retorna null para id inexistente", () => {
    expect(svc.verDetalle("999")).toBeNull();
  });
});
