"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar actividades..."
        aria-label="Buscar actividades"
        className="w-full rounded-2xl border-2 border-caribe-200 bg-white py-3 pl-12 pr-4 text-base outline-none transition-colors placeholder:text-slate-400 focus:border-caribe-400 focus:ring-2 focus:ring-caribe-100"
      />
    </div>
  );
}
