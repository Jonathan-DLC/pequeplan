"use client";

import { useState, useEffect } from "react";
import { seedIfEmpty } from "@/lib/seed";

export function SeedProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    setReady(true);
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
