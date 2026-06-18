import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 py-8 text-center text-sm text-slate-400 flex flex-col items-center">
      <div className="flex items-center gap-2 justify-center">
        <Image src="/icon-192.png" alt="PequePlan Icon" width={24} height={24} className="rounded-md" />
        <p className="font-[family-name:var(--font-display)] text-caribe-600 font-semibold text-base">
          PequePlan
        </p>
      </div>
      <p className="mt-1.5 text-slate-400">Actividades infantiles en Barranquilla · 2026</p>
    </footer>
  );
}
