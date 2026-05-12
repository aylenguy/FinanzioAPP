"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import { useFinanzasStore, Movimiento } from "@/app/store/useFinanzasStore";
import { categoryConfig, categoryFallback, CATEGORIAS } from "@/lib/categoryConfig";

type Filtro = "todos" | "ingreso" | "gasto";

type MovForm = {
  tipo: "ingreso" | "gasto";
  descripcion: string;
  monto: string;
  categoria: string;
  fecha: string;
};

// ── Modal editar ──────────────────────────────────────────────────────────────
function EditModal({
  mov,
  onClose,
  onSave,
}: {
  mov: Movimiento;
  onClose: () => void;
  onSave: (data: MovForm) => void;
}) {
  const [form, setForm] = useState<MovForm>({
    tipo:        mov.tipo,
    descripcion: mov.descripcion,
    monto:       String(mov.monto),
    categoria:   mov.categoria,
    fecha:       mov.fecha.slice(0, 10),
  });

  const set = (k: keyof MovForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

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
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-800">Editar movimiento</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Tipo */}
          <div className="flex gap-2">
            {(["ingreso", "gasto"] as const).map((t) => (
              <button
                key={t}
                onClick={() => set("tipo", t)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  form.tipo === t
                    ? t === "ingreso"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-red-50 border-red-300 text-red-700"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                {t === "ingreso" ? "Ingreso" : "Gasto"}
              </button>
            ))}
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
          </div>

          {/* Monto */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Monto</label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.monto}
              onChange={(e) => set("monto", e.target.value)}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Categoría</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Fecha</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              value={form.fecha}
              onChange={(e) => set("fecha", e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => { if (form.descripcion.trim() && form.monto) onSave(form); }}
          className="mt-6 w-full bg-gray-900 text-white text-sm font-medium rounded-xl py-3 hover:bg-gray-700 transition-colors active:scale-[0.98]"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MovimientosPage() {
  const { movimientos, removeMovimiento, updateMovimiento, fetchMovimientos, loading } =
    useFinanzasStore();
  const [filtro, setFiltro]     = useState<Filtro>("todos");
  const [editando, setEditando] = useState<Movimiento | null>(null);

  useEffect(() => { fetchMovimientos(); }, [fetchMovimientos]);

  const filtrados =
    filtro === "todos" ? movimientos : movimientos.filter((m) => m.tipo === filtro);

  const handleSave = async (form: MovForm) => {
    if (!editando) return;
    await updateMovimiento(editando.id, {
      tipo:        form.tipo,
      descripcion: form.descripcion,
      monto:       Number(form.monto),
      categoria:   form.categoria,
      fecha:       form.fecha,
    });
    setEditando(null);
  };

  const handleRemove = (id: string, descripcion: string) => {
    if (!window.confirm(`¿Eliminar "${descripcion}"? Esta acción no se puede deshacer.`)) return;
    removeMovimiento(id);
  };

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    const ajustada = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return ajustada.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <>
    

      {editando && (
        <EditModal
          mov={editando}
          onClose={() => setEditando(null)}
          onSave={handleSave}
        />
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
        {/* Filtros */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["todos", "ingreso", "gasto"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filtro === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f === "todos" ? "Todos" : f === "ingreso" ? "Ingresos" : "Gastos"}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            {filtrados.length} movimientos
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          {/* ── Tabla desktop (md+) ── */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Descripción</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Categoría</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide text-right">Monto</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3 p-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtrados.length === 0 ? (
              <div className="px-5 py-12 text-center text-xs text-gray-400">
                No hay movimientos para mostrar
              </div>
            ) : (
              filtrados.map((mov) => {
                const cfg = categoryConfig[mov.categoria] ?? categoryFallback;
                const Icon = cfg.icon;
                return (
                  <div
                    key={mov.id}
                    className="grid grid-cols-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-gray-500" />
                      </div>
                      <span className="text-xs font-medium text-gray-800 truncate">{mov.descripcion}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                        {mov.categoria}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400">{formatFecha(mov.fecha)}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <span className={`text-xs font-semibold tabular-nums ${
                        mov.tipo === "ingreso" ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {mov.tipo === "ingreso" ? "+" : "-"}${mov.monto.toLocaleString("es-AR")}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditando(mov)} className="text-gray-300 hover:text-blue-400 transition-colors" aria-label="Editar">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleRemove(mov.id, mov.descripcion)} className="text-gray-300 hover:text-red-400 transition-colors" aria-label="Eliminar">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Lista mobile/tablet (< md) ── */}
          <div className="md:hidden">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtrados.length === 0 ? (
              <div className="px-5 py-12 text-center text-xs text-gray-400">
                No hay movimientos para mostrar
              </div>
            ) : (
              filtrados.map((mov) => {
                const cfg = categoryConfig[mov.categoria] ?? categoryFallback;
                const Icon = cfg.icon;
                return (
                  <div
                    key={mov.id}
                    className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0"
                  >
                    {/* Ícono */}
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-gray-500" />
                    </div>

                    {/* Info central */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{mov.descripcion}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatFecha(mov.fecha)} · {mov.categoria}
                      </p>
                    </div>

                    {/* Monto + acciones */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold tabular-nums ${
                        mov.tipo === "ingreso" ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {mov.tipo === "ingreso" ? "+" : "-"}${mov.monto.toLocaleString("es-AR")}
                      </span>
                      <button
                        onClick={() => setEditando(mov)}
                        className="p-1.5 text-gray-300 hover:text-blue-400 transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleRemove(mov.id, mov.descripcion)}
                        className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </>
  );
}
