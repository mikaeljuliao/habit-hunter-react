import React from "react";
import { Target, Calendar, Trophy, Archive } from "lucide-react";

export default function Filtros({ filtro, setFiltro }) {
  const baseClass =
    "flex items-center gap-1 px-3 py-1 rounded transition text-sm font-medium";

  const filtros = [
    { key: "todos", label: "Todos", icon: Target },
    { key: "diaria", label: "Diárias", icon: Calendar },
    { key: "semanal", label: "Semanais", icon: Calendar },
    { key: "objetivo", label: "Objetivos", icon: Trophy },
    { key: "arquivadas", label: "Lixeira", icon: Archive },
  ];

  return (
    <div
      className="flex flex-wrap gap-3"
      role="group"
      aria-label="Filtros de tarefas"
    >
      {filtros.map(({ key, label, icon: Icon }) => {
        const isActive = filtro === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => setFiltro(key)}
            aria-pressed={isActive}
            className={`${baseClass} ${
              isActive
                ? "bg-cyan-500 text-white shadow-md"
                : "bg-zinc-800 hover:bg-zinc-700 text-white"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}