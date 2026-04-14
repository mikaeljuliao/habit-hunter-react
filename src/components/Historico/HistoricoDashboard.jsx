import React from 'react';

export const HistoricoDashboard = ({ totalXpGanho, totalConcluidas, totalFalhas, taxaSucesso }) => {
  const cards = [
    { label: "XP Acumulado", value: totalXpGanho, color: "text-yellow-400" },
    { label: "Concluídas", value: totalConcluidas, color: "text-green-400" },
    { label: "Falhas", value: totalFalhas, color: "text-red-400" },
    { label: "Taxa de Sucesso", value: `${taxaSucesso}%`, color: "text-cyan-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">{card.label}</p>
        </div>
      ))}
    </div>
  );
};
