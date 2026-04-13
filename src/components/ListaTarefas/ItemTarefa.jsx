import React from 'react';
import { CheckCircle2, Trash2, Archive } from "lucide-react";

export const ItemTarefa = ({ item, jaFeitaHoje, arquivada, perdeuOntem, expirada, completarTarefa, solicitarAcaoModal }) => {
  const bloqueada = expirada || perdeuOntem;

  return (
    <div className={`flex justify-between py-3 px-3 items-center rounded-xl border transition-all ${
      arquivada ? "bg-gray-700/40 border-gray-500 opacity-70" :
      bloqueada ? "bg-red-900/30 border-red-500/30" :
      jaFeitaHoje ? "bg-green-900/30 border-green-500/30" : "bg-zinc-900 border-zinc-800"
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => !bloqueada && !arquivada && completarTarefa(item.id)}
          className={`w-8 h-8 border rounded-full flex items-center justify-center ${
            jaFeitaHoje ? "border-green-400" : "border-zinc-600"
          }`}
        >
          {jaFeitaHoje ? <CheckCircle2 size={18} className="text-green-400" /> : <div className="w-3 h-3 bg-zinc-500 rounded-full" />}
        </button>

        <div className="flex flex-col">
          <p className={`font-medium ${arquivada || jaFeitaHoje ? "line-through text-zinc-500" : ""}`}>{item.title}</p>
          <p className="text-xs text-yellow-400">Missão: {item.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-yellow-400">+{item.xp}</span>
        <button onClick={() => solicitarAcaoModal(item.id, 'remover')} className="text-zinc-400 hover:text-red-400"><Trash2 size={18}/></button>
        <button onClick={() => solicitarAcaoModal(item.id, arquivada ? 'restaurar' : 'limpar')}>
           <Archive size={18} className={arquivada ? "text-green-400" : "text-zinc-400"} />
        </button>
      </div>
    </div>
  );
};