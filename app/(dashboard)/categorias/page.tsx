"use client";

import Topbar from "@/app/components/Topbar";
import { useFinanzasStore } from "@/app/store/useFinanzasStore";
import { useEffect, useState } from "react";
import {
  ShoppingCart, Bus, Home, Zap, Gamepad2, Pill,
  Plus, Pencil, Trash2, X, LucideIcon,
} from "lucide-react";

const ICONOS: Record<string, LucideIcon> = {
  ShoppingCart, Bus, Home, Zap, Gamepad2, Pill,
};

const COLORES = [
  { label: "Azul",    value: "blue",    bar: "bg-blue-500",    icon: "text-blue-600",    bg: "bg-blue-50"    },
  { label: "Verde",   value: "emerald", bar: "bg-emerald-500", icon: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Violeta", value: "purple",  bar: "bg-purple-500",  icon: "text-purple-600",  bg: "bg-purple-50"  },
  { label: "Naranja", value: "amber",   bar: "bg-amber-500",   icon: "text-amber-600",   bg: "bg-amber-50"   },
  { label: "Rosa",    value: "pink",    bar: "bg-pink-500",    icon: "text-pink-600",    bg: "bg-pink-50"    },
  { label: "Rojo",    value: "red",     bar: "bg-red-400",     icon: "text-red-600",     bg: "bg-red-50"     },
];

const getColor = (color: string) =>
  COLORES.find((c) => c.value === color) ?? COLORES[0];

// ── Modal ─────────────────────────────────────────────────────────────────────
function CategoriaModal({
  inicial,
  onClose,
  onSave,
}: {
  inicial?: { id: string; nombre: string; icono: string; color: string };
  onClose: () => void;
  onSave: (data: { nombre: string; icono: string; color: string }) => void;
}) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [icono, setIcono]   = useState(inicial?.icono  ?? "ShoppingCart");
  const [color, setColor]   = useState(inicial?.color  ?? "blue");

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl
                   max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle mobile */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-800">
            {inicial ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nombre</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Comida"
            />
          </div>

          {/* Ícono */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ícono</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(ICONOS).map((key) => {
                const Icon = ICONOS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setIcono(key)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all
                      ${icono === key ? "border-gray-400 bg-gray-100" : "border-gray-100 hover:border-gray-300"}`}
                  >
                    <Icon size={15} className="text-gray-600" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Color</label>
            <div className="flex gap-3">
              {COLORES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  aria-label={c.label}
                  className={`w-7 h-7 rounded-full ${c.bar} border-2 transition-all
                    ${color === c.value ? "border-gray-500 scale-110" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (nombre.trim()) onSave({ nombre, icono, color }); }}
          className="mt-6 w-full bg-gray-900 text-white text-sm font-medium rounded-xl py-3 hover:bg-gray-700 transition-colors active:scale-[0.98]"
        >
          {inicial ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoriasPage() {
  const {
    categorias, movimientos,
    fetchCategorias, fetchMovimientos,
    addCategoria, updateCategoria, removeCategoria,
  } = useFinanzasStore();

  const [modal, setModal] = useState<
    null | "nueva" | { id: string; nombre: string; icono: string; color: string }
  >(null);

  useEffect(() => {
    fetchCategorias();
    fetchMovimientos();
  }, [fetchCategorias, fetchMovimientos]);

  const totalGastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((sum, m) => sum + m.monto, 0);

  const handleSave = async (data: { nombre: string; icono: string; color: string }) => {
    if (modal === "nueva") await addCategoria(data);
    else if (modal && typeof modal === "object") await updateCategoria(modal.id, data);
    setModal(null);
  };

  const handleRemove = (id: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${nombre}"?`)) return;
    removeCategoria(id);
  };

  return (
    <>
      <Topbar title="Categorías" />

      {modal && (
        <CategoriaModal
          inicial={modal === "nueva" ? undefined : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setModal("nueva")}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Plus size={13} /> Nueva categoría
          </button>
        </div>

        {categorias.length === 0 ? (
          <div className="text-center py-20 text-xs text-gray-400">
            No hay categorías todavía. ¡Creá una!
          </div>
        ) : (
          /* 1 col mobile, 2 col tablet, 3 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((cat) => {
              const Icon = ICONOS[cat.icono] ?? ShoppingCart;
              const c = getColor(cat.color);

              const movsCat = movimientos.filter(
                (m) => m.tipo === "gasto" &&
                       m.categoria.toLowerCase() === cat.nombre.toLowerCase()
              );
              const total = movsCat.reduce((sum, m) => sum + m.monto, 0);
              const porcentaje =
                totalGastos > 0 ? Math.round((total / totalGastos) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={c.icon} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {cat.nombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[11px] text-gray-400">{movsCat.length} movs.</span>
                      <button
                        aria-label="Editar categoría"
                        onClick={() => setModal({ id: cat.id, nombre: cat.nombre, icono: cat.icono, color: cat.color })}
                        className="p-1"
                      >
                        <Pencil size={13} className="text-gray-300 hover:text-gray-500 transition-colors" />
                      </button>
                      <button
                        aria-label="Eliminar categoría"
                        onClick={() => handleRemove(cat.id, cat.nombre)}
                        className="p-1"
                      >
                        <Trash2 size={13} className="text-gray-300 hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${c.bar} transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{porcentaje}% del total</span>
                    <span className="text-sm font-semibold text-gray-800 tabular-nums">
                      ${total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
