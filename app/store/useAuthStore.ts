import { create } from "zustand";

export interface Usuario {
  nombre: string;
  email: string;
}

interface AuthStore {
  token: string | null;
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
}

// ── API base desde variable de entorno ───────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7232/api";

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  usuario: null,

  initAuth: () => {
    const token   = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    if (token && usuario) {
      try {
        set({ token, usuario: JSON.parse(usuario) as Usuario });
      } catch {
        // usuario corrupto en localStorage, limpiar
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }
  },

  login: async (email, password) => {
    try {
    const res = await fetch(`${API}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json() as { token: string; nombre: string; email: string };
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({ nombre: data.nombre, email: data.email }));
      set({ token: data.token, usuario: { nombre: data.nombre, email: data.email } });
      return true;
    } catch {
      return false;
    }
  },

  register: async (nombre, email, password) => {
    try {
 const res = await fetch(`${API}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json() as { token: string; nombre: string; email: string };
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({ nombre: data.nombre, email: data.email }));
      set({ token: data.token, usuario: { nombre: data.nombre, email: data.email } });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    set({ token: null, usuario: null });
  },
}));