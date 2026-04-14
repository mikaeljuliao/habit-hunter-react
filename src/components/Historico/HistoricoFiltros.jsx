import React from 'react';

export const HistoricoFiltros = ({ filtroLogs, setFiltroLogs, compact = false }) => {
  const opcoes = [
    { key: 'todos',        label: 'Tudo' },
    { key: 'CONCLUSAO',    label: '✓ Concluídas' },
    { key: 'FALHA',        label: '✗ Falhas' },
    { key: 'REMOCAO',      label: '🗑 Removidas' },
    { key: 'ARQUIVAMENTO', label: '📦 Arquivadas' },
    { key: 'DESMARCADA',   label: '↩ Desfeitas' },
    { key: 'RESTAURADA',   label: '♻ Restauradas' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {opcoes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFiltroLogs(key)}
          className={`whitespace-nowrap transition-all font-bold rounded-lg ${
            compact 
              ? `px-2.5 py-1 text-[11px] ${filtroLogs === key ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`
              : `px-3 py-1.5 text-xs ${filtroLogs === key ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
