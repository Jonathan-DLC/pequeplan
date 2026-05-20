"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const links = [
  { href: "/admin", label: "📋 Actividades" },
  { href: "/admin/proveedores", label: "🏪 Proveedores" },
  { href: "/admin/reportes", label: "🚩 Reportes" },
  { href: "/admin/categorias", label: "🏷️ Categorías" },
  { href: "/admin/rangos-edad", label: "👶 Rangos de edad" },
  { href: "/admin/datos", label: "💾 Import/Export" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, esAdmin, loginConGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-caribe-200 border-t-caribe-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Acceso restringido</h1>
        <p className="text-sm text-slate-500 mb-6">Inicia sesión para acceder al panel de administración.</p>
        <button
          onClick={loginConGoogle}
          className="rounded-xl bg-caribe-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-caribe-600 transition-colors"
        >
          Iniciar con Google
        </button>
      </div>
    );
  }

  if (!esAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-4xl mb-4">⛔</p>
        <h1 className="text-xl font-bold text-slate-700 mb-2">Sin permisos</h1>
        <p className="text-sm text-slate-500">Tu cuenta ({user.email}) no tiene permisos de administrador.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:flex md:gap-6">
      <aside className="mb-6 md:mb-0 md:w-56 shrink-0">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-caribe-700 mb-4">
          Panel Admin
        </h2>
        <nav className="flex md:flex-col gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                pathname === l.href ? "bg-caribe-500 text-white" : "text-slate-600 hover:bg-caribe-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
