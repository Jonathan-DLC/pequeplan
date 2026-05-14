"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "📋 Actividades" },
  { href: "/admin/categorias", label: "🏷️ Categorías" },
  { href: "/admin/rangos-edad", label: "👶 Rangos de edad" },
  { href: "/admin/datos", label: "💾 Import/Export" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
