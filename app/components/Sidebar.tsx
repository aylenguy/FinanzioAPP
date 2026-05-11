"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  LayoutDashboard, ArrowLeftRight, Tag,
  BarChart2, Target, LogOut, LucideIcon, Menu, X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const navItems: NavGroup[] = [
  {
    section: "Principal",
    items: [
      { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
      { href: "/movimientos", label: "Movimientos", icon: ArrowLeftRight },
      { href: "/categorias",  label: "Categorías",  icon: Tag },
    ],
  },
  {
    section: "Análisis",
    items: [
      { href: "/reportes", label: "Reportes", icon: BarChart2 },
      { href: "/metas",    label: "Metas",    icon: Target },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { usuario, logout, initAuth } = useAuthStore();

  useEffect(() => { initAuth(); }, []);

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
    onClose?.();
  };

  const iniciales = usuario?.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            F
          </div>
          <div>
            <span className="font-semibold text-gray-900 text-sm">Finanzio</span>
            <p className="text-xs text-gray-400">Gestor de gastos</p>
          </div>
        </div>
        {/* Botón cerrar solo en mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 px-5 mb-1">
              {group.section}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-blue-600 font-medium"
                      : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
            {iniciales}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 truncate">{usuario?.nombre ?? "..."}</p>
            <p className="text-[11px] text-gray-400 truncate">{usuario?.email ?? ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Botón hamburguesa (solo mobile) ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* ── Sidebar fijo en desktop ── */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col h-full border-r border-gray-100">
        <SidebarContent />
      </aside>

      {/* ── Drawer overlay en mobile/tablet ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <aside className="relative w-64 h-full shadow-xl">
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
