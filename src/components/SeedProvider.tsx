"use client";

import { useEffect } from "react";
import { seedIfEmpty } from "@/lib/seed";

export function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return <>{children}</>;
}
