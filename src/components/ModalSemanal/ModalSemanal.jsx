import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

export default function ModalSemanal({
  aberto,
  tarefaTitulo,
  onCancelar,
  onConfirmar,
}) {
  const [dias, setDias] = useState(7);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <Calendar size={20} />
            <h2 className="text-lg font-bold">Duração da Missão</h2>
          </div>
          <button 
            onClick={onCancelar}
            className="text-zinc-500 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-zinc-300 mb-2 italic">"{tarefaTitulo}"</p>
        <p className="text-sm text-zinc-400 mb-6">
          Escolha por quantos dias esta missão semanal ficará ativa no seu painel:
        </p>

        <div className="flex justify-between gap-2 mb-8">
          {[3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              onClick={() => setDias(num)}
              className={`flex-1 py-3 rounded-xl border transition-all duration-200 font-bold ${
                dias === num
                  ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onConfirmar(dias)}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all active:scale-[0.98]"
          >
            CONFIRMAR ({dias} DIAS)
          </button>
          
          <button
            onClick={onCancelar}
            className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm font-medium transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
