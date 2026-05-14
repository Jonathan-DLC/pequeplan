import { Entidad } from "../models";

export class LocalStorageRepository<T extends Entidad> {
  constructor(private clave: string) {}

  obtenerTodos(): T[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.clave);
    return data ? JSON.parse(data) : [];
  }

  obtenerPorId(id: string): T | null {
    return this.obtenerTodos().find((e) => e.id === id) ?? null;
  }

  guardar(entidad: T): T {
    const todos = this.obtenerTodos();
    const idx = todos.findIndex((e) => e.id === entidad.id);
    if (idx >= 0) {
      todos[idx] = entidad;
    } else {
      todos.push(entidad);
    }
    localStorage.setItem(this.clave, JSON.stringify(todos));
    return entidad;
  }

  eliminar(id: string): void {
    const todos = this.obtenerTodos().filter((e) => e.id !== id);
    localStorage.setItem(this.clave, JSON.stringify(todos));
  }

  limpiar(): void {
    localStorage.removeItem(this.clave);
  }

  contar(): number {
    return this.obtenerTodos().length;
  }
}
