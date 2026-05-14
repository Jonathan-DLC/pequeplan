import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SeedProvider } from "@/components/SeedProvider";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PequePlan — Actividades infantiles en Barranquilla",
  description:
    "Encuentra actividades educativas, deportivas y culturales para niños en Barranquilla.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <SeedProvider>{children}</SeedProvider>
      </body>
    </html>
  );
}
