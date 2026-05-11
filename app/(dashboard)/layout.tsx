"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

const titulos: Record<string, string> = {
  "/dashboard":   "Dashboard",
  "/movimientos": "Movimientos",
  "/categorias":  "Categorías",
  "/reportes":    "Reportes",
  "/metas":       "Metas",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const titulo = titulos[pathname] ?? "Finanzio";

  return (
    <div className="flex h-dvh bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Topbar title={titulo} onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  );
}