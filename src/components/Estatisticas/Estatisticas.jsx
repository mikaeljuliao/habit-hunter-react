import React, { useMemo } from "react";
import {
  CheckCircle2,
  Trophy,
  Zap,
  Calendar,
  Target,
} from "lucide-react";

// Componente reutilizável para os cards de estatísticas
function StatCard({ icon: Icon, value, label, iconColor }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center shadow">
      <Icon className={`mx-auto mb-2 ${iconColor}`} size={24} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-zinc-400 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

export default function Estatisticas({ tarefas = [], execucoes = [] }) {
  const hoje = new Date().toISOString().split("T")[0];

  // Função para verificar se uma tarefa semanal expirou
  const verificarSeExpirou = (createdAt) => {
    if (!createdAt) return false;
    const dataCriacao = new Date(createdAt);
    const agora = new Date();
    const diasPassados = Math.floor(
      (agora - dataCriacao) / (1000 * 60 * 60 * 24)
    );
    return diasPassados >= 7;
  };

  // Cálculo das estatísticas com memoização
  const {
    tarefasFeitasHoje,
    xpTotal,
    pendentesDiarias,
    pendentesSemanais,
    pendentesObjetivos,
    diasConsecutivos,
  } = useMemo(() => {
    const tarefasFeitasHoje = execucoes.filter(
      (e) => e.date === hoje
    ).length;

    const xpTotal = execucoes.reduce(
      (total, execucao) => total + (execucao.xp || 0),
      0
    );

    const pendentesDiarias = tarefas.filter(
      (t) =>
        t.type === "diaria" &&
        !execucoes.some(
          (e) => e.tarefaId === t.id && e.date === hoje
        )
    ).length;

    const pendentesSemanais = tarefas.filter(
      (t) =>
        t.type === "semanal" &&
        !verificarSeExpirou(t.createdAt) &&
        !execucoes.some((e) => e.tarefaId === t.id)
    ).length;

    const pendentesObjetivos = tarefas.filter(
      (t) =>
        t.type === "objetivo" &&
        !execucoes.some((e) => e.tarefaId === t.id)
    ).length;

    // Cálculo de dias consecutivos (streak)
    const datasUnicas = [
      ...new Set(execucoes.map((e) => e.date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    let diasConsecutivos = 0;
    let dataAtual = new Date(hoje);

    for (let i = 0; i < datasUnicas.length; i++) {
      const dataExecucao = new Date(datasUnicas[i]);
      if (
        dataExecucao.toISOString().split("T")[0] ===
        dataAtual.toISOString().split("T")[0]
      ) {
        diasConsecutivos++;
        dataAtual.setDate(dataAtual.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      tarefasFeitasHoje,
      xpTotal,
      pendentesDiarias,
      pendentesSemanais,
      pendentesObjetivos,
      diasConsecutivos,
    };
  }, [tarefas, execucoes, hoje]);

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          value={tarefasFeitasHoje}
          label="Completas Hoje"
          iconColor="text-green-400"
        />
        <StatCard
          icon={Trophy}
          value={diasConsecutivos}
          label="Dias Consecutivos"
          iconColor="text-orange-400"
        />
        <StatCard
          icon={Zap}
          value={xpTotal}
          label="XP Total"
          iconColor="text-yellow-400"
        />
      </div>

      {/* Pendências */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Calendar}
          value={pendentesDiarias}
          label="Diárias Pendentes"
          iconColor="text-cyan-400"
        />
        <StatCard
          icon={Target}
          value={pendentesSemanais}
          label="Semanais Pendentes"
          iconColor="text-purple-400"
        />
        <StatCard
          icon={Trophy}
          value={pendentesObjetivos}
          label="Objetivos Pendentes"
          iconColor="text-pink-400"
        />
      </div>
    </div>
  );
}