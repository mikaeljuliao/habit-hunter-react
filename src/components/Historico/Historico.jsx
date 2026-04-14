import React, { useState } from 'react';
import { History } from "lucide-react";
import { HistoricoDashboard } from "./HistoricoDashboard";
import { HistoricoFiltros } from "./HistoricoFiltros";
import { HistoricoDia } from "./HistoricoDia";

export const Historico = ({ logEventos, execucoes, falhasDiarias }) => {
  const [dataExpandida, setDataExpandida] = useState(null);
  const [filtroLogs, setFiltroLogs] = useState('todos');

  const hoje = new Date().toISOString().split("T")[0];

  // Agrupa logs por data
  const agrupado = logEventos.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const datasLog = Object.keys(agrupado).sort((a, b) => new Date(b) - new Date(a));

  // Métricas globais
  const totalXpGanho    = logEventos.filter(l => l.action === "CONCLUSAO").reduce((sum, l) => sum + l.xp, 0);
  const totalConcluidas = logEventos.filter(l => l.action === "CONCLUSAO").length;
  const totalFalhas     = logEventos.filter(l => l.action === "FALHA").length;
  const baseCalculo     = totalConcluidas + totalFalhas;
  const taxaSucesso     = baseCalculo === 0 ? 0 : Math.round((totalConcluidas / baseCalculo) * 100);

  if (datasLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600">
        <History size={48} strokeWidth={1} />
        <p className="text-base font-medium">Nenhum evento registrado ainda.</p>
        <p className="text-sm">Crie ou complete missões para ver o histórico aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HistoricoDashboard 
        totalXpGanho={totalXpGanho} 
        totalConcluidas={totalConcluidas} 
        totalFalhas={totalFalhas} 
        taxaSucesso={taxaSucesso} 
      />

      <HistoricoFiltros filtroLogs={filtroLogs} setFiltroLogs={setFiltroLogs} />

      <div className="space-y-3">
        {datasLog.map(data => {
          const logsDoDia = agrupado[data];
          
          const logsVisiveis = (filtroLogs === 'todos'
            ? logsDoDia
            : logsDoDia.filter(l => l.action === filtroLogs)
          ).filter(l => l.action !== 'CRIACAO');

          if (logsVisiveis.length === 0) return null;

          // Stats do dia usando estado real
          const execucoesDia  = execucoes.filter(e => e.date === data);
          const xpDia         = execucoesDia.reduce((s, e) => s + e.xp, 0);
          const concluidasDia = execucoesDia.length;
          const falhasDia     = falhasDiarias.filter(f => f.date === data).length;
          
          const logsCompletoDia = logsDoDia.filter(l => l.action !== 'CRIACAO');
          const removidosDia    = logsCompletoDia.filter(l => l.action === "REMOCAO").length;
          const arquivadosDia   = logsCompletoDia.filter(l => l.action === "ARQUIVAMENTO").length;
          const totalDia        = concluidasDia + falhasDia + removidosDia + arquivadosDia;

          return (
            <HistoricoDia 
              key={data}
              data={data}
              logsDoDia={logsDoDia}
              logsVisiveis={logsVisiveis}
              isHoje={data === hoje}
              isExpanded={data === dataExpandida}
              onToggle={() => setDataExpandida(data === dataExpandida ? null : data)}
              statsDia={{ xpDia, concluidasDia, falhasDia, removidosDia, arquivadosDia, totalDia }}
              filtroLogs={filtroLogs}
              setFiltroLogs={setFiltroLogs}
            />
          );
        })}
      </div>

      {/* Estado vazio para filtros */}
      {datasLog.every(data => 
        filtroLogs !== 'todos' && !agrupado[data].some(l => l.action === filtroLogs)
      ) && (
        <div className="text-center py-10 text-zinc-600 text-sm italic">
          Nenhum evento do tipo selecionado encontrado no histórico.
        </div>
      )}
    </div>
  );
};
