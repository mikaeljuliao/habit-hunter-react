import React from 'react';
import { ItemTarefa } from './ItemTarefa';

export const ListaTarefas = ({ tarefas, execucoes, falhasDiarias, tarefasOcultas, verificarSeExpirou, completarTarefa, solicitarAcaoModal }) => {
  const hoje = new Date().toISOString().split("T")[0];

  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const dataOntem = ontem.toISOString().split("T")[0];

  return (
    <div className="space-y-3">
      {tarefas.map((item) => {
        const jaFeitaHoje = execucoes.some(
          (e) => e.tarefaId === item.id && e.date === hoje
        );

        const perdeuOntem =
          item.type === "diaria" &&
          falhasDiarias.some(
            (f) => f.tarefaId === item.id && f.date === dataOntem
          );

        const tarefaExpirada =
          item.type === "semanal" && verificarSeExpirou(item.createdAt, item.duracaoDias);

        let diasRestantes = null;

        if (item.type === "semanal" && item.createdAt) {
          const dataCriacao = new Date(item.createdAt);
          const agora = new Date();
          const diasPassados = Math.floor(
            (agora - dataCriacao) / (1000 * 60 * 60 * 24)
          );
          diasRestantes = Math.max(0, (item.duracaoDias || 7) - diasPassados);
        }

        const bloqueada = tarefaExpirada || perdeuOntem;
        const arquivada = tarefasOcultas.includes(item.id);

        return (
          <ItemTarefa
            key={item.id}
            item={item}
            jaFeitaHoje={jaFeitaHoje}
            arquivada={arquivada}
            bloqueada={bloqueada}
            perdeuOntem={perdeuOntem}
            tarefaExpirada={tarefaExpirada}
            diasRestantes={diasRestantes}
            completarTarefa={completarTarefa}
            solicitarAcaoModal={solicitarAcaoModal}
          />
        );
      })}
    </div>
  );
};