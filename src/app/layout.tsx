import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06b6d4",
};

export const metadata: Metadata = {
  title: "PequePlan — Actividades infantiles en Barranquilla",
  description:
    "Encuentra actividades educativas, deportivas y culturales para niños en Barranquilla. Busca por categoría, edad, zona y horario.",
  keywords: ["actividades infantiles", "niños", "Barranquilla", "deportes", "arte", "música", "educación"],
  openGraph: {
    title: "PequePlan — Actividades infantiles en Barranquilla",
    description: "Encuentra actividades educativas, deportivas y culturales para niños en Barranquilla.",
    type: "website",
    locale: "es_CO",
    siteName: "PequePlan",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
