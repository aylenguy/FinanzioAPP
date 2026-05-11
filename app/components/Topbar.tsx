"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, ChevronDown, X, Menu } from "lucide-react";
import { useFinanzasStore } from "@/app/store/useFinanzasStore";
import Sidebar from "@/app/components/Sidebar";

interface TopbarProps {
  title: string;
}

function NuevoMovimientoModal({ onClose }: { onClose: () => void }) {
  const addMovimiento = useFinanzasStore((s) => s.addMovimiento);

  const [tipo, setTipo]             = useState<"gasto" | "ingreso">("gasto");
  const [descripcion, setDesc]      = useState("");
  const [monto, setMonto]           = useState("");
  const [categoria, setCategoria]   = useState<string>("");
  const [fecha, setFecha]           = useState(new Date().toISOString().split("T")[0]);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const token = localStorage.getItem("token");
      const API = `${process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7232"}/api`;
      const res = await fetch(`${API}/Categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const nombres = data.map((c: { nombre: string }) => c.nombre);
      setCategorias(nombres);
      setCategoria(nombres[0] ?? "");
    };
    fetchCategorias();
  }, []);

  const reset = useCallback(() => {
    setDesc(""); setMonto(""); setCategoria(categorias[0] ?? "");
    setTipo("gasto"); setFecha(new Date().toISOString().split("T")[0]);
  }, [categorias]);

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!descripcion.trim() || !monto.trim()) return;
    await addMovimiento({ tipo, descripcion, monto: Number(monto), categoria, fecha });
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">Nuevo movimiento</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex rounded-lg border border-gray-200 p-0.5 mb-4">
          {(["gasto", "ingreso"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
                tipo === t
                  ? t === "gasto" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "gasto" ? "Gasto" : "Ingreso"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Descripción</label>
            <input
              type="text"
              placeholder="Ej: Supermercado"
              value={descripcion}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg pl-6 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Categoría</label>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="appearance-none w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleClose}
            className="flex-1 text-xs text-gray-500 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!descripcion.trim() || !monto.trim()}
            className="flex-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2.5 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ title }: TopbarProps) {
  const [showModal, setShowModal]   = useState(false);
  const [sidebarOpen, setSidebar]   = useState(false);

  return (
    <>
      {/* El Sidebar recibe el estado desde acá — sin botón flotante */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebar(false)} />

      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
        {/* Hamburger solo en mobile, pegado al header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebar(true)}
            className="md:hidden text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-lg"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Nuevo movimiento</span>
        </button>
      </header>

      {showModal && <NuevoMovimientoModal onClose={() => setShowModal(false)} />}
    </>
  );
}
