import React from "react";
import { Target, Calendar, Trophy, Archive, History } from "lucide-react";

export default function Filtros({ filtro, setFiltro }) {
  const filtros = [
    { key: "todos", label: "Todos", icon: Target },
    { key: "diaria", label: "Diárias", icon: Calendar },
    { key: "semanal", label: "Semanais", icon: Calendar },
    { key: "objetivo", label: "Objetivos", icon: Trophy },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800/50">
      {/* Categorias */}
      <div className="flex overflow-x-auto gap-1 pb-1 md:pb-0 scrollbar-none">
        {filtros.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
              filtro === key
                ? "bg-zinc-800 text-white shadow-md shadow-black/20"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80"
            }`}
            onClick={() => setFiltro(key)}
          >
            <Icon size={16} className={filtro === key ? "text-cyan-400" : "opacity-70"} />
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-zinc-800 hidden md:block"></div>

      {/* Sistema */}
      <div className="flex gap-1 shrink-0">
        <button
          className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg ${
            filtro === "arquivadas"
              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
              : "text-zinc-500 hover:text-yellow-500/80 hover:bg-yellow-500/5"
          }`}
          onClick={() => setFiltro("arquivadas")}
        >
          <Archive size={16} /> Lixeira
        </button>

        <button
          className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg ${
            filtro === "historico"
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              : "text-zinc-500 hover:text-cyan-400/80 hover:bg-cyan-500/5"
          }`}
          onClick={() => setFiltro("historico")}
        >
          <History size={16} /> Histórico
        </button>
      </div>
    </div>
  );
}