import React from 'react';
import { Plus } from "lucide-react";

export const FormularioTarefa = ({ 
  novaTarefa, 
  setNovaTarefa, 
  tipoTarefa, 
  setTipoTarefa, 
  adicionarTarefa,
  xpPorTipo 
}) => (
  <div className="bg-zinc-900 rounded-xl p-4 flex gap-2 flex-col sm:flex-row">
    <input
      type="text"
      placeholder="Nova missão..."
      value={novaTarefa}
      onChange={(e) => setNovaTarefa(e.target.value)}
      className="flex-1 bg-zinc-800 px-4 py-2 text-white rounded"
    />

    <select
      className="bg-zinc-800 px-3 py-2 text-zinc-100"
      value={tipoTarefa}
      onChange={(e) => setTipoTarefa(e.target.value)}
    >
      <option value="diaria">Diária (+{xpPorTipo.diaria} XP)</option>
      <option value="semanal">Semanal (+{xpPorTipo.semanal} XP)</option>
      <option value="objetivo">Objetivo (+{xpPorTipo.objetivo} XP)</option>
    </select>

    <button
      className="bg-cyan-500 hover:bg-cyan-600 transition rounded px-3 py-2 flex items-center justify-center"
      onClick={adicionarTarefa}
    >
      <Plus />
    </button>
  </div>
);