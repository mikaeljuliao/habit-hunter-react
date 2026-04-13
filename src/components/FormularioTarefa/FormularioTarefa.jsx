import React from 'react';
import { Plus } from "lucide-react";

export const FormularioTarefa = ({ novaTarefa, setNovaTarefa, tipoTarefa, setTipoTarefa, adicionarTarefa }) => (
  <div className="bg-zinc-900 rounded-xl p-4 flex gap-2 flex-col sm:flex-row">
    <input
      type="text"
      placeholder="Nova missão..."
      value={novaTarefa}
      onChange={(e) => setNovaTarefa(e.target.value)}
      className="flex-1 bg-zinc-800 px-4 py-2 text-white rounded border border-zinc-700 focus:border-cyan-500 outline-none"
    />
    <select
      className="bg-zinc-800 px-3 py-2 text-zinc-100 rounded border border-zinc-700"
      value={tipoTarefa}
      onChange={(e) => setTipoTarefa(e.target.value)}
    >
      <option value="diaria">Diária (+50 XP)</option>
      <option value="semanal">Semanal (+200 XP)</option>
      <option value="objetivo">Objetivo (+500 XP)</option>
    </select>
    <button
      className="bg-cyan-500 hover:bg-cyan-600 transition rounded px-4 py-2 flex items-center justify-center"
      onClick={adicionarTarefa}
    >
      <Plus size={20} />
    </button>
  </div>
);