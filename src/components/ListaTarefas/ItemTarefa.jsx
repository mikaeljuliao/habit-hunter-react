import React from 'react';
import { CheckCircle2, Trash2, Archive, Calendar, Trophy, Target, Clock } from "lucide-react";

export const ItemTarefa = ({
  item,
  jaFeitaHoje,
  arquivada,
  bloqueada,
  perdeuOntem,
  tarefaExpirada,
  diasRestantes,
  completarTarefa,
  solicitarAcaoModal
}) => {

  const agora = new Date();
  const fimDoDia = new Date();
  fimDoDia.setHours(23, 59, 59, 999);
  const tempoRestante = fimDoDia - agora;
  const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
  const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);

  return (
    <div
      className={`group flex items-center justify-between p-4 sm:px-5 sm:py-4 rounded-xl border transition-all duration-300 ${
        arquivada
          ? "bg-zinc-900/90 border-zinc-700 border-dashed opacity-100 shadow-none text-zinc-300 hover:bg-zinc-800"
          : perdeuOntem || tarefaExpirada
          ? "bg-red-950/10 border-red-900/30 hover:border-red-500/40 hover:bg-red-950/20"
          : jaFeitaHoje
          ? "bg-green-950/10 border-green-900/30 hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.05)] text-zinc-400"
          : "bg-zinc-900/80 border-zinc-800/80 hover:border-cyan-500/40 hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer"
      }`}
      onClick={() => {
        if (!bloqueada && !arquivada) completarTarefa(item.id);
      }}
    >
      {/* LADO ESQUERDO: Check e Título */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (bloqueada || arquivada) return;
            completarTarefa(item.id);
          }}
          disabled={bloqueada || arquivada}
          className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 border-2 rounded-full flex items-center justify-center transition-all duration-300 outline-none ${
            bloqueada || arquivada
              ? "opacity-40 cursor-not-allowed border-zinc-700 bg-zinc-900"
              : jaFeitaHoje
              ? "border-green-500 bg-green-500/20 text-green-400 scale-105 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              : "border-zinc-500 bg-zinc-950 group-hover:border-cyan-400 group-hover:bg-cyan-950/30 text-transparent hover:scale-110 active:scale-90"
          }`}
        >
          <CheckCircle2 size={20} className={jaFeitaHoje ? "opacity-100" : "opacity-0 group-hover:opacity-40 text-cyan-400 transition-opacity"} strokeWidth={3} />
        </button>

        <div className="flex flex-col min-w-0">
          <p className={`font-semibold text-base sm:text-lg truncate transition-colors duration-300 ${
            arquivada
              ? "line-through text-zinc-400 opacity-80"
              : jaFeitaHoje
              ? "line-through text-zinc-500"
              : "text-zinc-100 group-hover:text-cyan-50"
          }`}>
            {item.title}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-zinc-800/50 text-cyan-400 border-zinc-700/50 ${
              arquivada || jaFeitaHoje ? 'opacity-50' : ''
            }`}>
               {item.type}
            </span>

            {arquivada && (
              <span className="text-[10px] sm:text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-zinc-700">
                <Archive size={10} /> Arquivada
              </span>
            )}

            {!arquivada && (
              <>
                {item.type === "diaria" && perdeuOntem && (
                  <span className="text-[10px] sm:text-xs text-red-400 font-bold bg-red-400/10 px-2 rounded">FALHOU ONTEM</span>
                )}
                
                {item.type === "diaria" && !jaFeitaHoje && !perdeuOntem && (
                  <span className="text-[10px] sm:text-xs text-zinc-500 flex items-center gap-1">
                    <Clock size={10} /> {horas}h {minutos}m
                  </span>
                )}

                {item.type === "semanal" && (
                   tarefaExpirada ? (
                    <span className="text-[10px] sm:text-xs text-red-400 font-bold bg-red-400/10 px-2 rounded">EXPIRADA</span>
                   ) : (
                    <span className="text-[10px] sm:text-xs text-zinc-500 flex items-center gap-1">
                      <Clock size={10} /> {diasRestantes} dias rest.
                    </span>
                   )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* LADO DIREITO: XP e Ações Ocultas */}
      <div className="flex items-center gap-4">
        <div className={`flex flex-col items-end transition-opacity duration-300 ${arquivada || jaFeitaHoje ? 'opacity-40' : 'opacity-100'}`}>
          <span className="text-xs text-zinc-500 font-bold">XP</span>
          <span className={`text-lg font-black ${arquivada ? 'text-zinc-500' : 'text-cyan-400'}`}>+{item.xp}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <div className="h-8 w-px bg-zinc-800 mx-2 hidden sm:block"></div>
          
          <button
            onClick={(e) => { e.stopPropagation(); solicitarAcaoModal(item.id, "remover"); }}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Remover"
          >
            <Trash2 size={18} />
          </button>

          {arquivada ? (
            <button
              onClick={(e) => { e.stopPropagation(); solicitarAcaoModal(item.id, "restaurar"); }}
              className="p-2 text-zinc-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
              title="Restaurar"
            >
              <Archive size={18} />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); solicitarAcaoModal(item.id, "limpar"); }}
              className="p-2 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
              title="Arquivar"
            >
              <Archive size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};