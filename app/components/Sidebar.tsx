"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  LayoutDashboard, ArrowLeftRight, Tag,
  BarChart2, Target, LogOut, LucideIcon,
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
      { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
      { href: "/movimientos",  label: "Movimientos",  icon: ArrowLeftRight },
      { href: "/categorias",   label: "Categorías",   icon: Tag },
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

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { usuario, logout, initAuth } = useAuthStore();

  useEffect(() => { initAuth(); }, []);

  const handleLogout = () => {
    logout();
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  const iniciales = usuario?.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            F
          </div>
          <span className="font-semibold text-gray-900 text-sm">Finanzio</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-9">Gestor de gastos</p>
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
                  className={`flex items-center gap-3 px-5 py-2 text-sm transition-all border-l-2 ${
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
    </aside>
  );
}