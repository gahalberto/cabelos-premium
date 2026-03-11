"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/app/lib/utils";
import {
  Package,
  Building2,
  BarChart3,
  Settings,
  Users,
  ShoppingCart,
  FileText,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  History,
} from "lucide-react";

const allMenuItems = [
  { title: "Dashboard",          href: "/admin",                     icon: BarChart3,      roles: ["ADMIN", "VENDEDOR"] },
  { title: "Produtos",           href: "/admin/products",            icon: Package,        roles: ["ADMIN", "VENDEDOR"] },
  { title: "Categorias",         href: "/admin/categories",          icon: FileText,       roles: ["ADMIN", "VENDEDOR"] },
  { title: "Pedidos",            href: "/admin/orders",              icon: ShoppingCart,   roles: ["ADMIN", "VENDEDOR"] },
  { title: "Aplicações Expert",  href: "/admin/expert-applications", icon: Building2,      roles: ["ADMIN"] },
  { title: "Usuários",           href: "/admin/users",               icon: Users,          roles: ["ADMIN"] },
  { title: "Contatos",           href: "/admin/contacts",            icon: MessageSquare,  roles: ["ADMIN"] },
  { title: "Histórico",          href: "/admin/activity-log",        icon: History,        roles: ["ADMIN"] },
  { title: "Configurações",      href: "/admin/configuracao",        icon: Settings,       roles: ["ADMIN"] },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const user = session?.user;
  const role = (user as any)?.role ?? "ADMIN";
  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // base
          "flex flex-col h-full bg-white border-r border-gray-200",
          // mobile: fixed drawer
          "fixed left-0 top-0 z-50 h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // desktop: sticky, always visible
          "lg:relative lg:translate-x-0 lg:z-auto lg:h-screen lg:sticky lg:top-0",
          // width
          "w-64 transition-all duration-300 ease-in-out",
          collapsed && "lg:w-16"
        )}
      >
        {/* ── Header ───────────────────────────────── */}
        <div className={cn(
          "flex items-center gap-2 h-16 px-4 border-b border-gray-200 flex-shrink-0",
          collapsed ? "lg:justify-center lg:px-0" : "justify-between"
        )}>
          {/* Logo */}
          <div className={cn("flex items-center gap-2 min-w-0", collapsed && "lg:hidden")}>
            <div className="w-8 h-8 bg-[#8a7d5c] rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 truncate">Admin</span>
          </div>

          {/* Ícone quando colapsado */}
          <div className={cn("hidden", collapsed && "lg:flex w-8 h-8 bg-[#8a7d5c] rounded-lg items-center justify-center")}>
            <Package className="h-4 w-4 text-white" />
          </div>

          {/* Botão colapsar — desktop */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-gray-400",
              "hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0",
              collapsed && "lg:hidden"
            )}
            title="Recolher menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Fechar — mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Navegação ─────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group",
                  isActive
                    ? "bg-[#8a7d5c] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "lg:justify-center lg:px-0"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>
                  {item.title}
                </span>

                {/* Tooltip colapsado */}
                {collapsed && (
                  <span className="hidden lg:block absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Rodapé: perfil + logout ───────────────── */}
        <div className="flex-shrink-0 border-t border-gray-200">
          {/* Botão expandir (só aparece quando colapsado) */}
          {collapsed && (
            <div className="hidden lg:flex justify-center py-2 border-b border-gray-100">
              <button
                onClick={() => setCollapsed(false)}
                title="Expandir menu"
                className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Perfil do usuário */}
          <div className={cn(
            "flex items-center gap-3 px-4 py-3",
            collapsed && "lg:justify-center lg:px-0 lg:py-3"
          )}>
            {/* Avatar com iniciais */}
            <div className="w-9 h-9 rounded-full bg-[#8a7d5c] flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
              {getInitials(user?.name)}
            </div>

            {/* Nome + email */}
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "Administrador"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            {/* Tooltip perfil quando colapsado */}
            {collapsed && (
              <span className="hidden lg:block absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                {user?.name}
              </span>
            )}
          </div>

          {/* Botão Sair */}
          <div className="px-2 pb-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                "text-red-600 hover:bg-red-50 transition-colors group relative",
                collapsed && "lg:justify-center lg:px-0"
              )}
              title={collapsed ? "Sair" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className={cn(collapsed && "lg:hidden")}>Sair</span>

              {collapsed && (
                <span className="hidden lg:block absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Sair
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
