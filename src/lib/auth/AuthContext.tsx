"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const ADMIN_EMAILS = ["jonathan_lozano1489@americana.edu.co", "jonathandavidlozano583@gmail.com"];

interface AuthState {
  user: User | null;
  loading: boolean;
  esAdmin: boolean;
  loginConGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  esAdmin: false,
  loginConGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const loginConGoogle = async () => {
    if (!auth) return;
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const esAdmin = ADMIN_EMAILS.includes(user?.email ?? "");

  return (
    <AuthContext.Provider value={{ user, loading, esAdmin, loginConGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
