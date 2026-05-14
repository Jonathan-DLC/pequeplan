import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageRepository } from "@/lib/repositories";
import { Entidad } from "@/lib/models";

interface TestEntity extends Entidad {
  id: string;
  nombre: string;
}

describe("LocalStorageRepository", () => {
  let repo: LocalStorageRepository<TestEntity>;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStorageRepository<TestEntity>("test-entities");
  });

  it("retorna array vacío si no hay datos", () => {
    expect(repo.obtenerTodos()).toEqual([]);
  });

  it("guarda y obtiene una entidad", () => {
    const entidad = { id: "1", nombre: "Test" };
    repo.guardar(entidad);
    expect(repo.obtenerPorId("1")).toEqual(entidad);
  });

  it("actualiza una entidad existente", () => {
    repo.guardar({ id: "1", nombre: "Original" });
    repo.guardar({ id: "1", nombre: "Actualizado" });
    expect(repo.obtenerPorId("1")?.nombre).toBe("Actualizado");
    expect(repo.contar()).toBe(1);
  });

  it("elimina una entidad", () => {
    repo.guardar({ id: "1", nombre: "A" });
    repo.guardar({ id: "2", nombre: "B" });
    repo.eliminar("1");
    expect(repo.contar()).toBe(1);
    expect(repo.obtenerPorId("1")).toBeNull();
  });

  it("limpia todas las entidades", () => {
    repo.guardar({ id: "1", nombre: "A" });
    repo.guardar({ id: "2", nombre: "B" });
    repo.limpiar();
    expect(repo.contar()).toBe(0);
  });

  it("retorna null si la entidad no existe", () => {
    expect(repo.obtenerPorId("inexistente")).toBeNull();
  });

  it("cuenta correctamente", () => {
    repo.guardar({ id: "1", nombre: "A" });
    repo.guardar({ id: "2", nombre: "B" });
    repo.guardar({ id: "3", nombre: "C" });
    expect(repo.contar()).toBe(3);
  });
});
