"use client";

import Link from "next/link";

export function Header() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-50 border-b border-caribe-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Navegación principal">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl font-bold text-caribe-600 transition-colors hover:text-coral-500"
          >
            🎈 PequePlan
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 hover:text-caribe-600 transition-colors">
              Inicio
            </Link>
            <Link href="/favoritas" className="text-slate-600 hover:text-coral-500 transition-colors">
              ❤️ Favoritas
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
              Admin
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
