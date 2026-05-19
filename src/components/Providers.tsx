"use client";

import { AuthProvider } from "@/lib/auth/AuthContext";
import { SeedProvider } from "@/components/SeedProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SeedProvider>{children}</SeedProvider>
    </AuthProvider>
  );
}
