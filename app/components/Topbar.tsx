"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, ChevronDown, X } from "lucide-react";
import { useFinanzasStore } from "@/app/store/useFinanzasStore";
// 👇 ya no importás CATEGORIAS

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
  const [categorias, setCategorias] = useState<string[]>([]);  // 👈 desde la API

  useEffect(() => {
    const fetchCategorias = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Categorias`, {
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">Nuevo movimiento</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tipo */}
        <div className="flex rounded-lg border border-gray-200 p-0.5 mb-4">
          {(["gasto", "ingreso"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
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
          {/* Descripción */}
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Descripción</label>
            <input
              type="text"
              placeholder="Ej: Supermercado"
              value={descripcion}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-300"
            />
          </div>

          {/* Monto */}
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
                className="w-full text-xs border border-gray-200 rounded-lg pl-6 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Categoría</label>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="appearance-none w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {categorias.map((c) => (   // 👈 ya no es CATEGORIAS
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handleClose}
            className="flex-1 text-xs text-gray-500 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!descripcion.trim() || !monto.trim()}
            className="flex-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ title }: TopbarProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded-lg"
        >
          <Plus size={14} />
          Nuevo movimiento
        </button>
      </header>
      {showModal && <NuevoMovimientoModal onClose={() => setShowModal(false)} />}
    </>
  );
}