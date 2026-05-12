"use client";

import { useFinanzasStore } from "@/app/store/useFinanzasStore";
import { useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const MESES_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const formatARS = (v: number) => "$" + (v / 1000).toFixed(0) + "k";

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm text-xs">
      <p className="font-semibold text-gray-700 mb-2">{String(label)}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 capitalize">{p.name}</span>
          <span className="font-semibold tabular-nums" style={{ color: p.color }}>
            ${(p.value ?? 0).toLocaleString("es-AR")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ReportesPage() {
  const { movimientos, fetchMovimientos } = useFinanzasStore();

  useEffect(() => { fetchMovimientos(); }, [fetchMovimientos]);

  const anoActual = useMemo(() => {
    if (movimientos.length === 0) return new Date().getFullYear();
    const conteo: Record<number, number> = {};
    movimientos.forEach((m) => {
      const y = new Date(m.fecha).getFullYear();
      conteo[y] = (conteo[y] ?? 0) + 1;
    });
    return Number(Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0]);
  }, [movimientos]);

  const movimientosDelAno = useMemo(
    () => movimientos.filter((m) => new Date(m.fecha).getFullYear() === anoActual),
    [movimientos, anoActual]
  );

  const datosPorMes = useMemo(() => {
    const mapa: Record<number, { ingresos: number; gastos: number }> = {};
    movimientosDelAno.forEach((m) => {
      const mes = new Date(m.fecha).getMonth();
      if (!mapa[mes]) mapa[mes] = { ingresos: 0, gastos: 0 };
      if (m.tipo === "ingreso") mapa[mes].ingresos += m.monto;
      else mapa[mes].gastos += m.monto;
    });
    return Object.entries(mapa)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([mes, valores]) => ({
        mes: MESES_LABELS[Number(mes)],
        ...valores,
      }));
  }, [movimientosDelAno]);

  const { totalIngresos, totalGastos } = useMemo(() => {
    return movimientosDelAno.reduce(
      (acc, m) => {
        if (m.tipo === "ingreso") acc.totalIngresos += m.monto;
        else acc.totalGastos += m.monto;
        return acc;
      },
      { totalIngresos: 0, totalGastos: 0 }
    );
  }, [movimientosDelAno]);

  const ahorro = totalIngresos - totalGastos;
  const pctAhorro =
    totalIngresos > 0 ? ((ahorro / totalIngresos) * 100).toFixed(1) : "0.0";
  const mesesConDatos = datosPorMes.length;

  return (
    <>
      

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-5">

        {/* Stats — 1 col en mobile, 3 en sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5">
            <p className="text-xs text-gray-400 mb-1">Total ingresos ({anoActual})</p>
            <p className="text-xl md:text-2xl font-semibold text-emerald-600 tabular-nums">
              ${totalIngresos.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Acumulado {mesesConDatos} {mesesConDatos === 1 ? "mes" : "meses"}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5">
            <p className="text-xs text-gray-400 mb-1">Total gastos ({anoActual})</p>
            <p className="text-xl md:text-2xl font-semibold text-red-500 tabular-nums">
              ${totalGastos.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Acumulado {mesesConDatos} {mesesConDatos === 1 ? "mes" : "meses"}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5">
            <p className="text-xs text-gray-400 mb-1">Ahorro neto ({anoActual})</p>
            <p className={`text-xl md:text-2xl font-semibold tabular-nums ${ahorro >= 0 ? "text-blue-600" : "text-red-500"}`}>
              ${ahorro.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-gray-400 mt-1">{pctAhorro}% de los ingresos</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex-1">
          <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
            <h2 className="text-xs font-semibold text-gray-700">Ingresos vs Gastos por mes</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span className="text-xs text-gray-400">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
                <span className="text-xs text-gray-400">Gastos</span>
              </div>
            </div>
          </div>

          {datosPorMes.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-xs text-gray-400">
              No hay datos para mostrar
            </div>
          ) : (
            /* Altura menor en mobile para que no ocupe toda la pantalla */
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={datosPorMes} barCategoryGap="30%" barGap={4}>
                <CartesianGrid vertical={false} stroke="#f3f4f6" strokeDasharray="0" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatARS}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="ingresos" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos"   fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </main>
    </>
  );
}
