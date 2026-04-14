import React from 'react';
import { ChevronDown, ChevronRight } from "lucide-react";
import { HistoricoItem } from "./HistoricoItem";
import { HistoricoFiltros } from "./HistoricoFiltros";

export const HistoricoDia = ({ 
  data, 
  logsVisiveis, 
  logsDoDia, 
  isHoje, 
  isExpanded, 
  onToggle, 
  statsDia,
  filtroLogs,
  setFiltroLogs
}) => {
  const { xpDia, concluidasDia, falhasDia, removidosDia, arquivadosDia, totalDia } = statsDia;

  const partes = data.split('-');
  const dataFormatada = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      isHoje ? 'border-cyan-500/40 shadow-md shadow-cyan-500/5' : 'border-zinc-800'
    } bg-zinc-900`}>
      {/* Cabeçalho Accordion */}
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-zinc-800/60 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isExpanded
            ? <ChevronDown size={18} className="text-cyan-400 shrink-0" />
            : <ChevronRight size={18} className="text-zinc-600 shrink-0" />
          }
          <div className="min-w-0">
            <p className={`font-bold text-base ${isHoje ? 'text-cyan-400' : 'text-white'}`}>
              {isHoje ? '📅 Hoje' : dataFormatada}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{logsVisiveis.length} evento(s)</p>
          </div>
        </div>

        {/* Badges Rápidas */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {xpDia > 0 && (
            <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
              +{xpDia} XP
            </span>
          )}
          {concluidasDia > 0 && (
            <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
              {concluidasDia} ✓
            </span>
          )}
          {falhasDia > 0 && (
            <span className="text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full">
              {falhasDia} ✗
            </span>
          )}
        </div>
      </button>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/50 px-5 py-4 space-y-4">
          {/* Dashboard do Dia */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
               { label: "Total", value: totalDia, color: "text-zinc-300" },
               { label: "XP Ganho", value: xpDia > 0 ? `+${xpDia}` : 0, color: "text-yellow-400" },
               { label: "Concluídas", value: concluidasDia, color: "text-green-400" },
               { label: "Falhas", value: falhasDia, color: "text-red-400" },
               { label: "Rem./Arq.", value: removidosDia + arquivadosDia, color: "text-zinc-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <HistoricoFiltros filtroLogs={filtroLogs} setFiltroLogs={setFiltroLogs} compact />

          {/* Lista de Eventos */}
          <div className="space-y-2">
            {logsVisiveis.length > 0 ? (
              logsVisiveis
                .sort((a, b) => b.id - a.id)
                .map(log => <HistoricoItem key={log.id} log={log} />)
            ) : (
              <p className="text-zinc-600 text-sm text-center py-4 italic">
                Nenhum evento deste tipo neste dia.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
