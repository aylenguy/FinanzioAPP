"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";

type Modo = "login" | "register";

interface Errores {
  nombre?: string;
  email?: string;
  password?: string;
}

const validarEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();

  const [modo, setModo]       = useState<Modo>("login");
  const [nombre, setNombre]   = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const validar = (): boolean => {
    const e: Errores = {};

    if (modo === "register" && nombre.trim().length < 2)
      e.nombre = "El nombre debe tener al menos 2 caracteres.";

    if (!validarEmail(email))
      e.email = "El email no es válido.";

    if (password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres.";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    setError("");

    const ok = modo === "login"
      ? await login(email, password)
      : await register(nombre, email, password);

    setLoading(false);

    if (ok) {
      document.cookie = `token=${useAuthStore.getState().token}; path=/`;
      router.push("/dashboard");
    } else {
      setError(modo === "login"
        ? "Email o contraseña incorrectos."
        : "No se pudo crear la cuenta. El email puede estar en uso.");
    }
  };

  const cambiarModo = () => {
    setModo(modo === "login" ? "register" : "login");
    setError("");
    setErrores({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            F
          </div>
          <span className="font-semibold text-gray-900">Finanzio</span>
        </div>

        <h1 className="text-lg font-semibold text-gray-900 mb-1">
          {modo === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          {modo === "login" ? "Ingresá a tu cuenta para continuar." : "Completá los datos para registrarte."}
        </p>

        <div className="flex flex-col gap-3">
          {/* Nombre (solo register) */}
          {modo === "register" && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nombre</label>
              <input
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                  errores.nombre ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-400"
                }`}
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setErrores((p) => ({ ...p, nombre: undefined })); }}
              />
              {errores.nombre && <p className="text-[11px] text-red-500 mt-1">{errores.nombre}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                errores.email ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-400"
              }`}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrores((p) => ({ ...p, email: undefined })); }}
            />
            {errores.email && <p className="text-[11px] text-red-500 mt-1">{errores.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Contraseña</label>
            <input
              type="password"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                errores.password ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-400"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPass(e.target.value); setErrores((p) => ({ ...p, password: undefined })); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errores.password && <p className="text-[11px] text-red-500 mt-1">{errores.password}</p>}
          </div>

          {/* Error general */}
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm font-medium rounded-xl py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "Cargando..." : modo === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          {modo === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button onClick={cambiarModo} className="text-blue-600 font-medium hover:underline">
            {modo === "login" ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}