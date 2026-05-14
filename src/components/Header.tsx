"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-caribe-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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
        </div>
      </nav>
    </header>
  );
}
