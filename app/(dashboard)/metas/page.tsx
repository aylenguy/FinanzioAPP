"use client";

import Topbar from "@/app/components/Topbar";
import { useFinanzasStore } from "@/app/store/useFinanzasStore";
import { useEffect, useState } from "react";
import {
  Shield, Plane, Laptop, BookOpen, Plus, Pencil, Trash2, X, type LucideIcon,
} from "lucide-react";

const ICONOS: Record<string, LucideIcon> = { Shield, Plane, Laptop, BookOpen };

const COLORES = [
  { label: "Azul",    value: "blue",    bar: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50"    },
  { label: "Naranja", value: "amber",   bar: "bg-amber-500",   text: "text-amber-600",   bg: "bg-amber-50"   },
  { label: "Verde",   value: "emerald", bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Violeta", value: "purple",  bar: "bg-purple-500",  text: "text-purple-600",  bg: "bg-purple-50"  },
  { label: "Rosa",    value: "pink",    bar: "bg-pink-500",    text: "text-pink-600",    bg: "bg-pink-50"    },
];

const getColor = (color: string) => COLORES.find((c) => c.value === color) ?? COLORES[0];

type MetaForm = {
  nombre: string;
  montoObjetivo: string;
  montoActual: string;
  icono: string;
  color: string;
  fechaLimite: string;
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function MetaModal({
  inicial,
  onClose,
  onSave,
}: {
  inicial?: MetaForm & { id: string };
  onClose: () => void;
  onSave: (data: MetaForm) => void;
}) {
  const [form, setForm] = useState<MetaForm>({
    nombre:        inicial?.nombre        ?? "",
    montoObjetivo: inicial?.montoObjetivo ?? "",
    montoActual:   inicial?.montoActual   ?? "0",
    icono:         inicial?.icono         ?? "Shield",
    color:         inicial?.color         ?? "blue",
    fechaLimite:   inicial?.fechaLimite   ?? "",
  });

  const set = (k: keyof MetaForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    /* Bottom sheet en mobile, modal centrado en sm+ */
    <div
      className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl
                   max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle visual mobile */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-800">
            {inicial ? "Editar meta" : "Nueva meta"}
          </h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Nombre */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Nombre</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej: Vacaciones"
            />
          </div>

          {/* Montos — apilados en mobile, grid en sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Monto objetivo</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                value={form.montoObjetivo}
                onChange={(e) => set("montoObjetivo", e.target.value)}
                placeholder="500000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Monto actual</label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
                value={form.montoActual}
                onChange={(e) => set("montoActual", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Fecha límite */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Fecha límite (opcional)</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.fechaLimite}
              onChange={(e) => set("fechaLimite", e.target.value)}
            />
          </div>

          {/* Ícono */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ícono</label>
            <div className="flex gap-2">
              {Object.keys(ICONOS).map((key) => {
                const Icon = ICONOS[key];
                return (
                  <button
                    key={key}
                    onClick={() => set("icono", key)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all
                      ${form.icono === key ? "border-gray-400 bg-gray-100" : "border-gray-100 hover:border-gray-300"}`}
                    aria-label={key}
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
                  onClick={() => set("color", c.value)}
                  aria-label={c.label}
                  className={`w-7 h-7 rounded-full ${c.bar} border-2 transition-all
                    ${form.color === c.value ? "border-gray-500 scale-110" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (form.nombre.trim() && form.montoObjetivo) onSave(form); }}
          className="mt-6 w-full bg-gray-900 text-white text-sm font-medium rounded-xl py-3 hover:bg-gray-700 transition-colors active:scale-[0.98]"
        >
          {inicial ? "Guardar cambios" : "Crear meta"}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MetasPage() {
  const { metas, fetchMetas, addMeta, updateMeta, removeMeta } = useFinanzasStore();
  const [modal, setModal] = useState<null | "nueva" | (MetaForm & { id: string })>(null);

  useEffect(() => { fetchMetas(); }, [fetchMetas]);

  const handleSave = async (form: MetaForm) => {
    const payload = {
      nombre:        form.nombre,
      montoObjetivo: Number(form.montoObjetivo),
      montoActual:   Number(form.montoActual),
      icono:         form.icono,
      color:         form.color,
      fechaLimite:   form.fechaLimite || undefined,
    };
    if (modal === "nueva") await addMeta(payload);
    else if (modal && typeof modal === "object") await updateMeta(modal.id, payload);
    setModal(null);
  };

  const handleRemove = (id: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar la meta "${nombre}"? Esta acción no se puede deshacer.`)) return;
    removeMeta(id);
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return "Sin fecha límite";
    const d = new Date(fecha);
    const ajustada = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return ajustada.toLocaleDateString("es-AR", { month: "short", year: "numeric" });
  };

  return (
    <>
      <Topbar title="Metas" />

      {modal && (
        <MetaModal
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
            <Plus size={13} /> Nueva meta
          </button>
        </div>

        {metas.length === 0 ? (
          <div className="text-center py-20 text-xs text-gray-400">
            No tenés metas todavía. ¡Creá una!
          </div>
        ) : (
          /* 1 col en mobile, 2 en sm+ */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metas.map((meta) => {
              const Icon = ICONOS[meta.icono] ?? Shield;
              const c = getColor(meta.color);
              const porcentaje =
                meta.montoObjetivo > 0
                  ? Math.min(Math.round((meta.montoActual / meta.montoObjetivo) * 100), 100)
                  : 0;
              const completada = porcentaje === 100;

              return (
                <div
                  key={meta.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={c.text} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{meta.nombre}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {completada ? "Meta alcanzada" : `Límite: ${formatFecha(meta.fechaLimite)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {completada && (
                        <span className="hidden sm:inline text-[11px] bg-emerald-50 text-emerald-600 font-medium px-2 py-1 rounded-full">
                          ✓ Completada
                        </span>
                      )}
                      <button
                        aria-label="Editar meta"
                        onClick={() =>
                          setModal({
                            id:            meta.id,
                            nombre:        meta.nombre,
                            montoObjetivo: String(meta.montoObjetivo),
                            montoActual:   String(meta.montoActual),
                            icono:         meta.icono,
                            color:         meta.color,
                            fechaLimite:   meta.fechaLimite ?? "",
                          })
                        }
                        className="p-1.5"
                      >
                        <Pencil size={13} className="text-gray-300 hover:text-gray-500 transition-colors" />
                      </button>
                      <button
                        aria-label="Eliminar meta"
                        onClick={() => handleRemove(meta.id, meta.nombre)}
                        className="p-1.5"
                      >
                        <Trash2 size={13} className="text-gray-300 hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* Badge completada en mobile (debajo del header) */}
                  {completada && (
                    <div className="sm:hidden mb-3">
                      <span className="text-[11px] bg-emerald-50 text-emerald-600 font-medium px-2 py-1 rounded-full">
                        ✓ Completada
                      </span>
                    </div>
                  )}

                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold tabular-nums ${c.text}`}>
                      {porcentaje}%
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      ${meta.montoActual.toLocaleString("es-AR")} / ${meta.montoObjetivo.toLocaleString("es-AR")}
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
