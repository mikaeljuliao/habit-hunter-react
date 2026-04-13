import React from 'react';
import { ItemTarefa } from './ItemTarefa';

export const ListaTarefas = ({ tarefas, execucoes, falhasDiarias, tarefasOcultas, completarTarefa, solicitarAcaoModal }) => {
  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-3">
      {tarefas.map((item) => (
        <ItemTarefa
          key={item.id}
          item={item}
          jaFeitaHoje={execucoes.some(e => e.tarefaId === item.id && e.date === hoje)}
          arquivada={tarefasOcultas.includes(item.id)}
          // Adicione aqui a lógica de falhas/expiração se necessário
          completarTarefa={completarTarefa}
          solicitarAcaoModal={solicitarAcaoModal}
        />
      ))}
    </div>
  );
};