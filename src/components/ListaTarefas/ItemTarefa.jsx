import React from 'react';
import { CheckCircle2, Trash2, Archive } from "lucide-react";

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
      className={`flex justify-between py-3 px-3 items-center rounded-xl border ${
        arquivada
          ? "bg-gray-700/40 border-gray-500 opacity-70"
          : perdeuOntem || tarefaExpirada
          ? "bg-red-900/30 border-red-500/30"
          : jaFeitaHoje
          ? "bg-green-900/30 border-green-500/30"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      {/* LADO ESQUERDO */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (bloqueada || arquivada) return;
            completarTarefa(item.id);
          }}
          disabled={bloqueada || arquivada}
          className={`w-8 h-8 border rounded-full flex items-center justify-center ${
            bloqueada || arquivada
              ? "opacity-50 cursor-not-allowed border-gray-500"
              : "border-zinc-600"
          }`}
        >
          {jaFeitaHoje ? (
            <CheckCircle2 size={18} className="text-green-400" />
          ) : (
            <div className="w-3 h-3 bg-zinc-500 rounded-full" />
          )}
        </button>

        <div className="flex flex-col">
          <p
            className={`font-medium ${
              arquivada
                ? "line-through text-gray-400"
                : jaFeitaHoje
                ? "line-through text-zinc-400"
                : ""
            }`}
          >
            {item.title}
          </p>

          {arquivada && (
            <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded w-fit mt-1 flex items-center gap-1">
              <Archive size={12} className="text-gray-300" />
              Arquivada
            </span>
          )}

          <p className="text-xs text-yellow-400">Missão: {item.type}</p>

          {/* DIÁRIA */}
          {item.type === "diaria" && (
            <>
              {perdeuOntem && !arquivada && (
                <p className="text-xs text-red-400">❌ Falhou ontem</p>
              )}
              {!arquivada && (
                <p className="text-xs text-zinc-400 mt-1">
                  ⏳ Termina em: {horas}h {minutos}m
                </p>
              )}
            </>
          )}

          {/* SEMANAL */}
          {item.type === "semanal" && !arquivada && (
            tarefaExpirada ? (
              <p className="text-xs text-red-400">❌ Expirada</p>
            ) : (
              <p className="text-xs text-zinc-400">
                ⏳ {diasRestantes} dias restantes
              </p>
            )
          )}

          {/* OBJETIVO */}
          {item.type === "objetivo" && !arquivada && (
            <p className="text-xs text-zinc-400">Objetivo livre (sem prazo)</p>
          )}
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-4">
        <span
          className={`font-bold ${
            arquivada ? "text-gray-400" : "text-yellow-400"
          }`}
        >
          +{item.xp}
        </span>

        <button onClick={() => solicitarAcaoModal(item.id, "remover")}>
          <Trash2 size={18} />
        </button>

        {arquivada ? (
          <button
            onClick={() => solicitarAcaoModal(item.id, "restaurar")}
            className="text-green-400 hover:text-green-300 transition"
            title="Restaurar tarefa"
          >
            <Archive size={18} />
          </button>
        ) : (
          <button
            onClick={() => solicitarAcaoModal(item.id, "limpar")}
            className="text-zinc-400 hover:text-white transition"
            title="Arquivar tarefa"
          >
            <Archive size={18} />
          </button>
        )}
      </div>
    </div>
  );
};