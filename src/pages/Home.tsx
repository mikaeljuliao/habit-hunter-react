import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header/Header';
import { Estatisticas } from '../components/Estatisticas/Estatisticas';
import { FormularioTarefa } from '../components/FormularioTarefa/FormularioTarefa';
import { Filtros } from '../components/Filtros/Filtros';
import { ListaTarefas } from '../components/ListaTarefas/ListaTarefas';
import { ModalConfirmacao } from '../components/ModalConfirmacao/ModalConfirmacao';
import { xpParaSubir, calcularRank, calcularProgresso } from '../utils/calculosXp';

export default function Home() {
  // 💡 NOTA: Seus estados (tarefas, nivel, xp, filtro, etc) e funções 
  // de lógica (adicionarTarefa, completarTarefa) devem estar aqui 
  // ou vindo do seu hook useLocalStorage.

  // Cálculos de XP e Rank
  const rank = calcularRank(nivel);
  const xpNecessario = xpParaSubir(nivel);
  const progresso = calcularProgresso(xp, nivel);

  // Lógica de filtragem das tarefas
  const tarefasFiltradas = useMemo(() => {
    if (filtro === 'arquivadas') {
      return tarefas.filter(t => tarefasOcultas.includes(t.id));
    }
    if (filtro === 'todos') {
      return tarefas.filter(t => !tarefasOcultas.includes(t.id));
    }
    return tarefas.filter(t => t.type === filtro && !tarefasOcultas.includes(t.id));
  }, [tarefas, tarefasOcultas, filtro]);

  // =====================
  // 📌 RENDER
  // =====================
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Header 
          nivel={nivel}
          xp={xp}
          xpNecessario={xpNecessario}
          progresso={progresso}
          rank={rank}
        />

        <Estatisticas 
          tarefas={tarefas} 
          execucoes={execucoes} 
        />

        <FormularioTarefa 
          novaTarefa={novaTarefa}
          setNovaTarefa={setNovaTarefa}
          tipoTarefa={tipoTarefa}
          setTipoTarefa={setTipoTarefa}
          adicionarTarefa={adicionarTarefa}
        />

        <Filtros 
          filtro={filtro} 
          setFiltro={setFiltro} 
        />

        <ListaTarefas 
          tarefas={tarefasFiltradas}
          execucoes={execucoes}
          falhasDiarias={falhasDiarias}
          tarefasOcultas={tarefasOcultas}
          completarTarefa={completarTarefa}
          solicitarAcaoModal={solicitarAcaoModal}
        />

      </div>
    </div>
  );
}