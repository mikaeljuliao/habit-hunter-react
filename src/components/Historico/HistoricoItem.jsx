import React from 'react';
import { Plus, CheckCircle2, Trash2, XCircle, Archive, Target, Calendar } from "lucide-react";

const ACAO_CONFIG = {
  CRIACAO:      { label: "Missão Criada",            cor: "text-blue-400",   borda: "border-blue-800/50",   fundo: "bg-blue-950/20",    Icon: Plus },
  CONCLUSAO:    { label: "Concluída",                cor: "text-green-400",  borda: "border-green-800/50",  fundo: "bg-green-950/20",   Icon: CheckCircle2 },
  FALHA:        { label: "Falha — não realizada",    cor: "text-red-400",    borda: "border-red-800/50",    fundo: "bg-red-950/20",     Icon: XCircle },
  REMOCAO:      { label: "Removida permanentemente", cor: "text-red-400",    borda: "border-red-900/40",    fundo: "bg-red-950/10",     Icon: Trash2 },
  ARQUIVAMENTO: { label: "Arquivada",                cor: "text-yellow-500", borda: "border-yellow-800/40", fundo: "bg-yellow-950/15",  Icon: Archive },
  DESMARCADA:   { label: "Conclusão desfeita",       cor: "text-orange-400", borda: "border-orange-800/40", fundo: "bg-orange-950/15",  Icon: XCircle },
  RESTAURADA:   { label: "Restaurada da lixeira",    cor: "text-cyan-400",   borda: "border-cyan-800/40",   fundo: "bg-cyan-950/15",    Icon: Target },
};

export const HistoricoItem = ({ log }) => {
  const cfg = ACAO_CONFIG[log.action] || {
    label: log.action, 
    cor: 'text-zinc-400',
    borda: 'border-zinc-800', 
    fundo: 'bg-zinc-900', 
    Icon: Calendar
  };
  
  const { label, cor, borda, fundo, Icon } = cfg;

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${borda} ${fundo} transition hover:brightness-110`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg bg-zinc-950/60 border ${borda} shrink-0`}>
          <Icon size={16} className={cor} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${
            log.action === 'FALHA' || log.action === 'REMOCAO'
              ? 'text-zinc-500 line-through'
              : 'text-zinc-100'
          }`}>
            {log.title}
          </p>
          <p className={`text-xs mt-0.5 font-medium ${cor}`}>
            {label}
            <span className="text-zinc-600 mx-1.5">·</span>
            <span className="text-zinc-500 capitalize">{log.type}</span>
          </p>
        </div>
      </div>

      {log.xp !== 0 && (
        <span className={`text-xs font-black px-3 py-1.5 rounded-full shrink-0 border ${
          log.xp > 0 
            ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' 
            : 'text-orange-400 bg-orange-400/10 border-orange-400/20'
        }`}>
          {log.xp > 0 ? `+${log.xp}` : log.xp} XP
        </span>
      )}
    </div>
  );
};
