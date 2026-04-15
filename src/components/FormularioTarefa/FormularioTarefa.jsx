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
  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-2 sm:p-3 flex gap-2 flex-col sm:flex-row shadow-lg focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all duration-300 group">
    <input
      type="text"
      placeholder="Nova missão..."
      value={novaTarefa}
      onChange={(e) => setNovaTarefa(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
      className="flex-1 bg-zinc-950/50 px-4 py-3 text-white rounded-lg focus:outline-none placeholder:text-zinc-600 transition-colors"
    />

    <div className="flex gap-2">
      <select
        className="flex-1 sm:flex-none bg-zinc-950/50 border-r border-zinc-800 sm:border-none px-4 py-3 text-zinc-300 rounded-lg sm:rounded cursor-pointer focus:outline-none shrink-0 transition-colors hover:text-white"
        value={tipoTarefa}
        onChange={(e) => setTipoTarefa(e.target.value)}
      >
        <option value="diaria">Diária (+{xpPorTipo.diaria} XP)</option>
        <option value="semanal">Semanal (+{xpPorTipo.semanal} XP)</option>
        <option value="objetivo">Objetivo (+{xpPorTipo.objetivo} XP)</option>
      </select>

      <button
        className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] shrink-0"
        onClick={adicionarTarefa}
      >
        <Plus size={20} strokeWidth={3} />
        <span className="hidden sm:inline">Adicionar</span>
      </button>
    </div>
  </div>
);