import {
  ShoppingCart,
  Briefcase,
  Tv,
  Bus,
  Home,
  Banknote,
  Pill,
  HelpCircle,
  Music,        // Salidas
  ShoppingBag,  // Compras
  BookOpen,     // Educación
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  barColor: string;
}

export const categoryConfig: Record<string, CategoryConfig> = {
  Comida:     { icon: ShoppingCart, color: "bg-blue-50 text-blue-600",      barColor: "bg-blue-500"    },
  Ingreso:    { icon: Briefcase,    color: "bg-emerald-50 text-emerald-600", barColor: "bg-emerald-500" },
  Ocio:       { icon: Tv,           color: "bg-pink-50 text-pink-600",       barColor: "bg-pink-500"    },
  Transporte: { icon: Bus,          color: "bg-amber-50 text-amber-600",     barColor: "bg-amber-500"   },
  Vivienda:   { icon: Home,         color: "bg-purple-50 text-purple-600",   barColor: "bg-purple-500"  },
  Salidas:    { icon: Music,       color: "bg-violet-50 text-violet-600", barColor: "bg-violet-500" },
Compras:    { icon: ShoppingBag, color: "bg-orange-50 text-orange-600", barColor: "bg-orange-500" },
Educacion:  { icon: BookOpen,    color: "bg-cyan-50 text-cyan-600",     barColor: "bg-cyan-500"   },
  Servicios:  { icon: Banknote,     color: "bg-gray-50 text-gray-600",       barColor: "bg-gray-400"    },
  Salud:      { icon: Pill,         color: "bg-red-50 text-red-600",         barColor: "bg-red-400"     },
  Otros:      { icon: HelpCircle,   color: "bg-gray-50 text-gray-500",       barColor: "bg-gray-300"    },
};

export const categoryFallback: CategoryConfig = {
  icon: HelpCircle,
  color: "bg-gray-50 text-gray-400",
  barColor: "bg-gray-300",
};

export const CATEGORIAS = [
  "Comida",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Ocio",
  "Salud",
  "Salidas",
  "Compras",
  "Educacion",
  "Ingreso",
  "Otros",
] as const;

export type CategoriaName = (typeof CATEGORIAS)[number];