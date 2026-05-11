"use client";

import Topbar from "@/app/components/Topbar";
import Link from "next/link";
import { useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useFinanzasStore } from "@/app/store/useFinanzasStore";
import { categoryConfig, categoryFallback } from "@/lib/categoryConfig";

export default function DashboardPage() {
  const { movimientos, fetchMovimientos, loading } = useFinanzasStore();

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const ahora = new Date();
  const mesActual = movimientos.filter((m) => {
    const fecha = new Date(m.fecha);
    return (
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getFullYear() === ahora.getFullYear()
    );
  });

  const ingresos = mesActual
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);

  const gastos = mesActual
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = ingresos - gastos;

  const ultimos = movimientos.slice(0, 4);

  const gastosPorCategoria = mesActual
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + m.monto;
      return acc;
    }, {} as Record<string, number>);

  const maxGasto = Math.max(...Object.values(gastosPorCategoria), 1);

  const categorias = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: Math.round((amount / maxGasto) * 100),
    }));

  const fmt = (n: number) => "$" + n.toLocaleString("es-AR");

  const stats = [
    {
      label: "Ingresos del mes",
      value: fmt(ingresos),
      delta: ingresos > 0 ? "Este mes" : "Sin ingresos aún",
      icon: TrendingUp,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      valueColor: "text-emerald-600",
    },
    {
      label: "Gastos del mes",
      value: fmt(gastos),
      delta: gastos > 0 ? "Este mes" : "Sin gastos aún",
      icon: TrendingDown,
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      valueColor: "text-red-500",
    },
    {
      label: "Balance",
      value: fmt(balance),
      delta: balance >= 0 ? "Vas bien este mes 🎉" : "Cuidado con los gastos",
      icon: Wallet,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      valueColor: balance >= 0 ? "text-blue-600" : "text-red-500",
    },
  ];

  return (
    <>
      <Topbar title="Dashboard" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-5">

        {/* Stats — 1 col en mobile, 3 en sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                    <Icon size={16} className={stat.iconColor} />
                  </div>
                </div>
                <div>
                  {loading ? (
                    <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    <p className={`text-xl md:text-2xl font-semibold tracking-tight ${stat.valueColor}`}>
                      {stat.value}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{stat.delta}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom — 1 col en mobile, 2 en md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

          {/* Últimos movimientos */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-700">Últimos movimientos</h2>
              <Link
                href="/movimientos"
                className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : ultimos.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No hay movimientos aún</p>
            ) : (
              <div className="flex flex-col gap-1">
                {ultimos.map((mov) => {
                  const cfg = categoryConfig[mov.categoria] ?? categoryFallback;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{mov.descripcion}</p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(mov.fecha).toLocaleDateString("es-AR")} · {mov.categoria}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold tabular-nums ml-2 flex-shrink-0 ${
                          mov.tipo === "ingreso" ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {mov.tipo === "ingreso" ? "+" : "-"}{fmt(mov.monto)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gastos por categoría */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 flex flex-col">
            <h2 className="text-xs font-semibold text-gray-700 mb-4">Gastos por categoría</h2>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : categorias.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No hay gastos este mes</p>
            ) : (
              <div className="flex flex-col gap-3.5 flex-1 justify-center">
                {categorias.map((cat) => {
                  const cfg = categoryConfig[cat.name] ?? categoryFallback;
                  return (
                    <div key={cat.name} className="flex items-center gap-2 md:gap-3">
                      {/* Nombre truncado con ancho mínimo fijo */}
                      <span className="w-16 md:w-20 text-right text-xs text-gray-400 flex-shrink-0 truncate">
                        {cat.name}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cfg.barColor} transition-all duration-500`}
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-14 md:w-16 text-right flex-shrink-0 tabular-nums">
                        {fmt(cat.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
