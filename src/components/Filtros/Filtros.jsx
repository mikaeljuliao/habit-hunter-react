import React from "react";
import { Target, Calendar, Trophy } from "lucide-react";

export default function Filtros({ filtro, setFiltro }) {
  const baseClass =
    "bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1";

  const filtros = [
    { key: "todos", label: "Todos", icon: Target },
    { key: "diaria", label: "Diárias", icon: Calendar },
    { key: "semanal", label: "Semanais", icon: Calendar },
    { key: "objetivo", label: "Objetivos", icon: Trophy },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {filtros.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={baseClass}
          onClick={() => setFiltro(key)}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}