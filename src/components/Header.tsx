"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";

export function Header() {
  const { user, loading, esAdmin, loginConGoogle, logout } = useAuth();

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
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 hover:text-caribe-600 transition-colors">
              Inicio
            </Link>
            {user && (
              <Link href="/favoritas" className="text-slate-600 hover:text-coral-500 transition-colors">
                ❤️ Favoritas
              </Link>
            )}
            {user && (
              <Link href="/proveedor" className="text-slate-600 hover:text-caribe-600 transition-colors">
                🏪 Proveedor
              </Link>
            )}
            {esAdmin && (
              <Link href="/admin" className="text-slate-600 hover:text-caribe-600 transition-colors">
                ⚙️ Admin
              </Link>
            )}

            {loading ? (
              <span className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? "Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="hidden sm:inline text-xs text-slate-500 max-w-[100px] truncate">
                  {user.displayName?.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={loginConGoogle}
                className="rounded-xl bg-caribe-500 px-4 py-2 text-xs font-semibold text-white hover:bg-caribe-600 transition-colors"
              >
                Iniciar con Google
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
