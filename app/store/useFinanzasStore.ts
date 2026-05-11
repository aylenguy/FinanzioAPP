import { create } from "zustand";
import toast from "react-hot-toast";
 
export interface Movimiento {
  id: string;
  tipo: "gasto" | "ingreso";
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  creadoEn?: string;
}
 
export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}
 
export interface Meta {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  icono: string;
  color: string;
  fechaLimite?: string;
  creadoEn?: string;
}
 
// ── API base desde variable de entorno ───────────────────────────────────────
const API = `${process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7232"}/api`;
 
const getAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});
 
interface FinanzasStore {
  // Movimientos
  movimientos: Movimiento[];
  loading: boolean;
  error: string | null;
  fetchMovimientos: () => Promise<void>;
  addMovimiento: (m: Omit<Movimiento, "id" | "creadoEn">) => Promise<void>;
  updateMovimiento: (id: string, m: Omit<Movimiento, "id" | "creadoEn">) => Promise<void>;
  removeMovimiento: (id: string) => Promise<void>;
 
  // Categorías
  categorias: Categoria[];
  fetchCategorias: () => Promise<void>;
  addCategoria: (c: Omit<Categoria, "id">) => Promise<void>;
  updateCategoria: (id: string, c: Omit<Categoria, "id">) => Promise<void>;
  removeCategoria: (id: string) => Promise<void>;
 
  // Metas
  metas: Meta[];
  fetchMetas: () => Promise<void>;
  addMeta: (m: Omit<Meta, "id" | "creadoEn">) => Promise<void>;
  updateMeta: (id: string, m: Omit<Meta, "id" | "creadoEn">) => Promise<void>;
  removeMeta: (id: string) => Promise<void>;
}
 
export const useFinanzasStore = create<FinanzasStore>((set) => ({
  // ── Movimientos ──────────────────────────────────────────────────────────
  movimientos: [],
  loading: false,
  error: null,
 
  fetchMovimientos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/movimientos`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Error al obtener movimientos");
      const data: Movimiento[] = await res.json();
      set({ movimientos: data, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      set({ loading: false, error: msg });
      toast.error("No se pudieron cargar los movimientos");
    }
  },
 
  addMovimiento: async (m) => {
    const toastId = toast.loading("Guardando...");
    try {
      const res = await fetch(`${API}/movimientos`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(m),
      });
      if (!res.ok) throw new Error("Error al crear movimiento");
      const nuevo: Movimiento = await res.json();
      set((state) => ({ movimientos: [nuevo, ...state.movimientos] }));
      toast.success("Movimiento agregado", { id: toastId });
    } catch {
      toast.error("No se pudo guardar el movimiento", { id: toastId });
    }
  },
 
  updateMovimiento: async (id, m) => {
    const toastId = toast.loading("Guardando cambios...");
    try {
      const res = await fetch(`${API}/movimientos/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(m),
      });
      if (!res.ok) throw new Error("Error al actualizar movimiento");
      const updated: Movimiento = await res.json();
      set((state) => ({
        movimientos: state.movimientos.map((mov) => (mov.id === id ? updated : mov)),
      }));
      toast.success("Movimiento actualizado", { id: toastId });
    } catch {
      toast.error("No se pudo actualizar el movimiento", { id: toastId });
    }
  },
 
  removeMovimiento: async (id) => {
    const toastId = toast.loading("Eliminando...");
    try {
      const res = await fetch(`${API}/movimientos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error al eliminar movimiento");
      set((state) => ({
        movimientos: state.movimientos.filter((m) => m.id !== id),
      }));
      toast.success("Movimiento eliminado", { id: toastId });
    } catch {
      toast.error("No se pudo eliminar el movimiento", { id: toastId });
    }
  },
 
  // ── Categorías ───────────────────────────────────────────────────────────
  categorias: [],
 
  fetchCategorias: async () => {
    try {
      const res = await fetch(`${API}/categorias`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Error al obtener categorías");
      const data: Categoria[] = await res.json();
      set({ categorias: data });
    } catch {
      toast.error("No se pudieron cargar las categorías");
    }
  },
 
  addCategoria: async (c) => {
    const toastId = toast.loading("Guardando...");
    try {
      const res = await fetch(`${API}/categorias`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(c),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      const nueva: Categoria = await res.json();
      set((state) => ({ categorias: [...state.categorias, nueva] }));
      toast.success("Categoría creada", { id: toastId });
    } catch {
      toast.error("No se pudo crear la categoría", { id: toastId });
    }
  },
 
  updateCategoria: async (id, c) => {
    const toastId = toast.loading("Guardando cambios...");
    try {
      const res = await fetch(`${API}/categorias/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(c),
      });
      if (!res.ok) throw new Error("Error al actualizar categoría");
      const updated: Categoria = await res.json();
      set((state) => ({
        categorias: state.categorias.map((cat) => (cat.id === id ? updated : cat)),
      }));
      toast.success("Categoría actualizada", { id: toastId });
    } catch {
      toast.error("No se pudo actualizar la categoría", { id: toastId });
    }
  },
 
  removeCategoria: async (id) => {
    const toastId = toast.loading("Eliminando...");
    try {
      const res = await fetch(`${API}/categorias/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      set((state) => ({
        categorias: state.categorias.filter((cat) => cat.id !== id),
      }));
      toast.success("Categoría eliminada", { id: toastId });
    } catch {
      toast.error("No se pudo eliminar la categoría", { id: toastId });
    }
  },
 
  // ── Metas ────────────────────────────────────────────────────────────────
  metas: [],
 
  fetchMetas: async () => {
    try {
      const res = await fetch(`${API}/metas`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Error al obtener metas");
      const data: Meta[] = await res.json();
      set({ metas: data });
    } catch {
      toast.error("No se pudieron cargar las metas");
    }
  },
 
  addMeta: async (m) => {
    const toastId = toast.loading("Guardando...");
    try {
      const res = await fetch(`${API}/metas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(m),
      });
      if (!res.ok) throw new Error("Error al crear meta");
      const nueva: Meta = await res.json();
      set((state) => ({ metas: [...state.metas, nueva] }));
      toast.success("Meta creada", { id: toastId });
    } catch {
      toast.error("No se pudo crear la meta", { id: toastId });
    }
  },
 
  updateMeta: async (id, m) => {
    const toastId = toast.loading("Guardando cambios...");
    try {
      const res = await fetch(`${API}/metas/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(m),
      });
      if (!res.ok) throw new Error("Error al actualizar meta");
      const updated: Meta = await res.json();
      set((state) => ({
        metas: state.metas.map((meta) => (meta.id === id ? updated : meta)),
      }));
      toast.success("Meta actualizada", { id: toastId });
    } catch {
      toast.error("No se pudo actualizar la meta", { id: toastId });
    }
  },
 
  removeMeta: async (id) => {
    const toastId = toast.loading("Eliminando...");
    try {
      const res = await fetch(`${API}/metas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error al eliminar meta");
      set((state) => ({
        metas: state.metas.filter((meta) => meta.id !== id),
      }));
      toast.success("Meta eliminada", { id: toastId });
    } catch {
      toast.error("No se pudo eliminar la meta", { id: toastId });
    }
  },
}));