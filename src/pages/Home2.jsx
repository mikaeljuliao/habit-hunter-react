import { Plus, Target, Calendar, Trophy, Zap, CheckCircle2, Trash2, ChevronDown, ChevronRight, XCircle, Archive, History, Edit2, Check } from "lucide-react";
import React, { useState, useEffect } from 'react'

export default function Home2() {

const tarefasIniciais = [{
  id: 1,
  title: 'treinar',
  xp: 50,
  type: 'diaria',
  createdAt: new Date().toISOString()
}]

// ===============================
// 📌 ESTADOS PRINCIPAIS
// ===============================
const [novaTarefa, setNovaTarefa] = useState("")
const [tipoTarefa, setTipoTarefa] = useState('diaria')
const [filtro, setFiltro] = useState('todos')
const [mostrarModal, setMostrarModal] = useState(false)
const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
const [tipoModal, setTipoModal] = useState(null)

const [nomeJogador, setNomeJogador] = useState(() => {
  return localStorage.getItem('nomeJogador') || "JOGADOR"
})
const [isEditingName, setIsEditingName] = useState(false)

// Estados do Histórico
const [dataExpandida, setDataExpandida] = useState(null);
const [filtroLogs, setFiltroLogs] = useState('todos');

// ===============================
// 📌 ESTADOS COM LOCALSTORAGE
// ===============================

// Tarefas
const [tarefa, setTarefa] = useState(() => {
  const tarefasSalvas = localStorage.getItem('tarefas')
  return tarefasSalvas ? JSON.parse(tarefasSalvas) : tarefasIniciais
})

// Nível
const [nivel, setNivel] = useState(() => {
  const nivelSalvo = localStorage.getItem('nivel')
  return nivelSalvo ? JSON.parse(nivelSalvo) : 1
})

// XP
const [xp, setXp] = useState(() => {
  const xpSalvo = localStorage.getItem('xp')
  return xpSalvo ? JSON.parse(xpSalvo) : 0
})

// Execuções (tarefas concluídas)
const [execucoes, setExecucoes] = useState(() => {
  const execucoesSalvas = localStorage.getItem('chaveExecucao')
  return execucoesSalvas ? JSON.parse(execucoesSalvas) : []
})

// Falhas das tarefas diárias
const [falhasDiarias, setFalhasDiarias] = useState(() => {
  const falhasSalvas = localStorage.getItem('falhasDiarias')
  return falhasSalvas ? JSON.parse(falhasSalvas) : []
})

// Última verificação de falhas
const [ultimaVerificacao, setUltimaVerificacao] = useState(() => {
  return localStorage.getItem('ultimaVerificacao') || null
})

const [tarefasOcultas, setTarefasOcultas] = useState(() => {
  const ocultasSalvas = localStorage.getItem('tarefasOcultas');
  return ocultasSalvas ? JSON.parse(ocultasSalvas) : [];
});

// ===============================
// 📌 SISTEMA DE LOGS DE EVENTOS
// ===============================
const [logEventos, setLogEventos] = useState(() => {
  const salvas = localStorage.getItem('logEventos')
  if (salvas) return JSON.parse(salvas);

  // Mock inicial para visualização nos primeiros 3 dias
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const ontem = d.toISOString().split("T")[0];
  d.setDate(d.getDate() - 1);
  const anteontem = d.toISOString().split("T")[0];
  d.setDate(d.getDate() - 1);
  const tresDias = d.toISOString().split("T")[0];

  return [
    { id: 102, action: "CONCLUSAO",    date: tresDias,  title: "Ler 20 páginas",  type: "diaria",  xp: 50 },
    { id: 103, action: "CONCLUSAO",    date: tresDias,  title: "Meditar 10 min",  type: "diaria",  xp: 50 },
    { id: 104, action: "ARQUIVAMENTO", date: anteontem, title: "Projeto Parado",   type: "objetivo",xp: 0 },
    { id: 108, action: "CONCLUSAO",    date: anteontem, title: "Revisar Projeto",  type: "semanal", xp: 200 },
    { id: 105, action: "FALHA",        date: ontem,     title: "Ir na Academia",  type: "diaria",  xp: 0 },
    { id: 106, action: "REMOCAO",      date: ontem,     title: "Tarefa Errada",   type: "diaria",  xp: 0 },
    { id: 107, action: "CONCLUSAO",    date: ontem,     title: "Tomar água 2L",   type: "diaria",  xp: 50 },
  ];
});

const registrarEvento = (action, title, type, xpGained = 0) => {
  const hojeLocal = new Date().toISOString().split("T")[0];
  setLogEventos(prev => [
    { id: Date.now() + Math.random(), action, date: hojeLocal, title, type, xp: xpGained },
    ...prev
  ]);
};

// ===============================
// 📌 PERSISTÊNCIA NO LOCALSTORAGE
// ===============================
useEffect(() => {
  localStorage.setItem('tarefas', JSON.stringify(tarefa))
}, [tarefa])

useEffect(() => {
  localStorage.setItem('nomeJogador', nomeJogador)
}, [nomeJogador])

useEffect(() => {
  localStorage.setItem('nivel', JSON.stringify(nivel))
}, [nivel])

useEffect(() => {
  localStorage.setItem('xp', JSON.stringify(xp))
}, [xp])

useEffect(() => {
  localStorage.setItem('chaveExecucao', JSON.stringify(execucoes))
}, [execucoes])

useEffect(() => {
  localStorage.setItem('falhasDiarias', JSON.stringify(falhasDiarias))
}, [falhasDiarias])

useEffect(() => {
  localStorage.setItem('ultimaVerificacao', ultimaVerificacao)
}, [ultimaVerificacao])

useEffect(() => {
  localStorage.setItem('tarefasOcultas', JSON.stringify(tarefasOcultas));
}, [tarefasOcultas]);

useEffect(() => {
  localStorage.setItem('logEventos', JSON.stringify(logEventos));
}, [logEventos]);

// ===============================
// 📌 VERIFICAÇÃO DE FALHAS DIÁRIAS
// ===============================
useEffect(() => {
  const hoje = new Date().toISOString().split("T")[0]

  if (ultimaVerificacao === hoje) return

  const ontem = new Date()
  ontem.setDate(ontem.getDate() - 1)
  const dataOntem = ontem.toISOString().split("T")[0]

  const falhas = tarefa
    .filter(t => t.type === 'diaria')
    .filter(t => !execucoes.some(e => e.tarefaId === t.id && e.date === dataOntem))
    .map(t => ({ tarefaId: t.id, date: dataOntem }))

  const novasFalhas = falhas.filter(f =>
    !falhasDiarias.some(p => p.tarefaId === f.tarefaId && p.date === f.date)
  );

  if (novasFalhas.length > 0) {
    setFalhasDiarias(prev => [...prev, ...novasFalhas])
    const novosLogs = novasFalhas.map(f => {
      const t = tarefa.find(x => x.id === f.tarefaId);
      return {
        id: Date.now() + Math.random(),
        action: "FALHA",
        date: dataOntem,
        title: t ? t.title : "Desconhecido",
        type: t ? t.type : "diaria",
        xp: 0
      };
    });
    setLogEventos(prev => [...novosLogs, ...prev]);
  }

  setUltimaVerificacao(hoje)
}, [tarefa, execucoes, ultimaVerificacao, falhasDiarias])

// ===============================
// 📌 FUNÇÕES DE NEGÓCIO
// ===============================
const xpParaSubir = (nivel) => nivel * 200

const xpNecessario = xpParaSubir(nivel)
const progresso = xpNecessario ? (xp / xpNecessario) * 100 : 0

const rank =
  nivel < 10 ? "E" :
  nivel < 20 ? "D" :
  nivel < 30 ? "C" : "B"

const ganharXp = (ganhoXp) => {
  const novoXp = xp + ganhoXp
  const xpNecessarioNivel = xpParaSubir(nivel)

  if (novoXp >= xpNecessarioNivel) {
    setNivel(nivel + 1)
    const xpRestante = novoXp - xpNecessarioNivel
    setXp(xpRestante)
  } else {
    setXp(novoXp)
  }
}

const adicionarTarefa = () => {
  if (!novaTarefa.trim()) return

  const xpRecompensa =
    tipoTarefa === 'objetivo' ? 500 :
    tipoTarefa === 'semanal' ? 200 :
    50

  setTarefa([
    ...tarefa,
    {
      id: Date.now(),
      title: novaTarefa,
      xp: xpRecompensa,
      type: tipoTarefa,
      createdAt: new Date().toISOString()
    }
  ])

  registrarEvento("CRIACAO", novaTarefa, tipoTarefa, 0);
  setNovaTarefa("")
}

const completarTarefa = (id) => {
  const tarefaEncontrada = tarefa.find((t) => t.id === id)
  if (!tarefaEncontrada) return

  const hoje = new Date().toISOString().split("T")[0]

  const jaExecutouHoje = execucoes.some(
    (e) => e.tarefaId === id && e.date === hoje
  )

  if (jaExecutouHoje) {
    setExecucoes(execucoes.filter((e) => !(e.tarefaId === id && e.date === hoje)))
    setXp((prev) => Math.max(0, prev - tarefaEncontrada.xp))
    // ✅ Remove o CONCLUSAO correspondente do log (mesma tarefa, mesmo dia)
    // e registra DESMARCADA — o histórico fica consistente com o estado real
    setLogEventos(prev => {
      const semConclusao = prev.filter(
        l => !(l.action === 'CONCLUSAO' && l.title === tarefaEncontrada.title && l.date === hoje)
      );
      return [
        { id: Date.now() + Math.random(), action: 'DESMARCADA', date: hoje, title: tarefaEncontrada.title, type: tarefaEncontrada.type, xp: -tarefaEncontrada.xp },
        ...semConclusao
      ];
    });
    return
  }

  ganharXp(tarefaEncontrada.xp)

  setExecucoes([
    ...execucoes,
    { tarefaId: id, date: hoje, xp: tarefaEncontrada.xp }
  ])
  registrarEvento("CONCLUSAO", tarefaEncontrada.title, tarefaEncontrada.type, tarefaEncontrada.xp);
}

const deletarTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) registrarEvento("REMOCAO", t.title, t.type, 0);
  setTarefa(tarefa.filter(t => t.id !== id))
}

const verificarSeExpirou = (createdAt) => {
  if (!createdAt) return false
  const dataCriacao = new Date(createdAt)
  const agora = new Date()
  const DIAS_LIMITE = 7
  const MS_POR_DIA = 1000 * 60 * 60 * 24
  const diasPassados = Math.floor((agora - dataCriacao) / MS_POR_DIA)
  return diasPassados >= DIAS_LIMITE
}

const limparTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) registrarEvento("ARQUIVAMENTO", t.title, t.type, 0);
  setTarefasOcultas((tarefasAnteriores) =>
    tarefasAnteriores.includes(id) ? tarefasAnteriores : [...tarefasAnteriores, id]
  );
};

const restaurarTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) {
    const hojeLocal = new Date().toISOString().split("T")[0];
    // ✅ Remove o ARQUIVAMENTO correspondente do log (mesma tarefa)
    // e registra RESTAURADA — histórico fica sem a entrada de arquivamento
    setLogEventos(prev => {
      const semArquivamento = prev.filter(
        l => !(l.action === 'ARQUIVAMENTO' && l.title === t.title)
      );
      return [
        { id: Date.now() + Math.random(), action: 'RESTAURADA', date: hojeLocal, title: t.title, type: t.type, xp: 0 },
        ...semArquivamento
      ];
    });
  }
  setTarefasOcultas((prev) => prev.filter((tarefaId) => tarefaId !== id));
};

const solicitarAcaoModal = (id, tipoDoModal) => {
  setTarefaSelecionadaId(id)
  setTipoModal(tipoDoModal)
  setMostrarModal(true)
}

const fecharModal = () => {
  setTarefaSelecionadaId(null)
  setMostrarModal(false)
  setTipoModal(null)
}

const confirmarAcaoModal = () => {
  if (tarefaSelecionadaId == null) return;
  if (tipoModal === 'remover')        deletarTarefa(tarefaSelecionadaId)
  else if (tipoModal === 'limpar')    limparTarefa(tarefaSelecionadaId)
  else if (tipoModal === 'restaurar') restaurarTarefa(tarefaSelecionadaId)
  fecharModal()
};

// ===============================
// 📌 FILTROS E MÉTRICAS
// ===============================
const tarefaFiltrada =
  filtro === 'arquivadas'
    ? tarefa.filter((t) => tarefasOcultas.includes(t.id))
    : filtro === 'todos'
      ? tarefa.filter((t) => !tarefasOcultas.includes(t.id))
      : tarefa.filter((t) => t.type === filtro && !tarefasOcultas.includes(t.id));

const xpTotal = execucoes.reduce((total, t) => total + t.xp, 0)

const xpPorTIpo = { diaria: 50, semanal: 200, objetivo: 500 }

const hoje = new Date().toISOString().split("T")[0]

const tarefasfeitasHoje = execucoes.filter((e) => e.date === hoje).length

const pendentesDiarias = tarefa.filter((t) =>
  t.type === 'diaria' && !execucoes.some((e) => e.tarefaId === t.id && e.date === hoje)
).length

const pendentesSemanais = tarefa.filter((t) =>
  t.type === 'semanal' && !verificarSeExpirou(t.createdAt) && !execucoes.some((e) => e.tarefaId === t.id)
).length

const pendentesObjetivos = tarefa.filter((t) =>
  t.type === 'objetivo' && !execucoes.some((e) => e.tarefaId === t.id)
).length

// ===============================
// 📌 CONTAGEM DE TEMPO RESTANTE DO DIA
// ===============================
const agora = new Date()
const fimDoDia = new Date()
fimDoDia.setHours(23, 59, 59, 999)
const tempoRestante = fimDoDia - agora
const horas = Math.floor(tempoRestante / (1000 * 60 * 60))
const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60)

// ===============================
// 📌 HISTÓRICO: CONFIG VISUAL POR AÇÃO
// ===============================
const ACAO_CONFIG = {
  CRIACAO:      { label: "Missão Criada",            cor: "text-blue-400",   borda: "border-blue-800/50",   fundo: "bg-blue-950/20",    Icon: Plus },
  CONCLUSAO:    { label: "Concluída",                cor: "text-green-400",  borda: "border-green-800/50",  fundo: "bg-green-950/20",   Icon: CheckCircle2 },
  FALHA:        { label: "Falha — não realizada",    cor: "text-red-400",    borda: "border-red-800/50",    fundo: "bg-red-950/20",     Icon: XCircle },
  REMOCAO:      { label: "Removida permanentemente", cor: "text-red-400",    borda: "border-red-900/40",    fundo: "bg-red-950/10",     Icon: Trash2 },
  ARQUIVAMENTO: { label: "Arquivada",                cor: "text-yellow-500", borda: "border-yellow-800/40", fundo: "bg-yellow-950/15",  Icon: Archive },
  DESMARCADA:   { label: "Conclusão desfeita",       cor: "text-orange-400", borda: "border-orange-800/40", fundo: "bg-orange-950/15",  Icon: XCircle },
  RESTAURADA:   { label: "Restaurada da lixeira",    cor: "text-cyan-400",   borda: "border-cyan-800/40",   fundo: "bg-cyan-950/15",    Icon: Target },
};

// ===============================
// 📌 MULTI-UI RENDER: HISTÓRICO NÍVEL SAAS
// ===============================
const renderHistorico = () => {
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
  // Taxa = concluídas / (concluídas + falhas), mostra eficiência real
  const baseCalculo  = totalConcluidas + totalFalhas;
  const taxaSucesso  = baseCalculo === 0 ? 0 : Math.round((totalConcluidas / baseCalculo) * 100);

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
    <div className="space-y-5">

      {/* DASHBOARD RESUMO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-yellow-400">{totalXpGanho}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">XP Acumulado</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-green-400">{totalConcluidas}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Concluídas</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-red-400">{totalFalhas}</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Falhas</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-cyan-400">{taxaSucesso}%</p>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">Taxa de Sucesso</p>
        </div>
      </div>

      {/* FILTRO GLOBAL */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'todos',        label: 'Tudo' },
          { key: 'CONCLUSAO',    label: '✓ Concluídas' },
          { key: 'FALHA',        label: '✗ Falhas' },
          { key: 'REMOCAO',      label: '🗑 Removidas' },
          { key: 'ARQUIVAMENTO', label: '📦 Arquivadas' },
          { key: 'DESMARCADA',   label: '↩ Desfeitas' },
          { key: 'RESTAURADA',   label: '♻ Restauradas' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltroLogs(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filtroLogs === key
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LISTA ACCORDION POR DIA */}
      <div className="space-y-3">
        {datasLog.map(data => {
          const logsDoDia = agrupado[data];

          // Aplica filtro global (ignora CRIACAO sempre)
          const logsVisiveis = (filtroLogs === 'todos'
            ? logsDoDia
            : logsDoDia.filter(l => l.action === filtroLogs)
          ).filter(l => l.action !== 'CRIACAO');

          if (logsVisiveis.length === 0) return null;

          const partes = data.split('-');
          const dataFormatada = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
          const isHoje     = data === hoje;
          const isExpanded = data === dataExpandida;

          // ── STATS DO DIA: usam os arrays de estado real ──
          // Concluídas e XP = execucoes reais do dia (já desconta DESMARCADA automaticamente)
          const execucoesDia  = execucoes.filter(e => e.date === data);
          const xpDia         = execucoesDia.reduce((s, e) => s + e.xp, 0);
          const concluidasDia = execucoesDia.length;
          // Falhas = falhasDiarias reais do dia
          const falhasDia     = falhasDiarias.filter(f => f.date === data).length;
          // Removidas e Arquivadas = logs (são permanentes ou já corrigidos via restaurar)
          const logsCompletoDia = logsDoDia.filter(l => l.action !== 'CRIACAO');
          const removidosDia    = logsCompletoDia.filter(l => l.action === "REMOCAO").length;
          const arquivadosDia   = logsCompletoDia.filter(l => l.action === "ARQUIVAMENTO").length;
          // Total do dia = todos os tipos distintos de tarefa que aparecem no estat
          const totalDia        = concluidasDia + falhasDia + removidosDia + arquivadosDia;

          return (
            <div key={data} className={`rounded-xl border overflow-hidden ${
              isHoje ? 'border-cyan-500/40 shadow-md shadow-cyan-500/5' : 'border-zinc-800'
            } bg-zinc-900`}>

              {/* Cabeçalho clicável */}
              <button
                className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-zinc-800/60 transition-colors"
                onClick={() => setDataExpandida(isExpanded ? null : data)}
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

                {/* Badges de resumo rápido */}
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

              {/* Feed expandido do dia */}
              {isExpanded && (
                <div className="border-t border-zinc-800 bg-zinc-950/50 px-5 py-4 space-y-4">

                  {/* ── RESUMO REAL DO DIA ── */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center col-span-1">
                      <p className="text-lg font-black text-zinc-300">{totalDia}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Total</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-lg font-black text-yellow-400">{xpDia > 0 ? `+${xpDia}` : 0}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">XP ganho</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-lg font-black text-green-400">{concluidasDia}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Concluídas</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-lg font-black text-red-400">{falhasDia}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Falhas</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-lg font-black text-zinc-500">{removidosDia + arquivadosDia}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Rem./Arq.</p>
                    </div>
                  </div>

                  {/* ── FILTRO INTERNO DO DIA ── */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { key: 'todos',        label: 'Tudo' },
                      { key: 'CONCLUSAO',    label: '✓ Concluídas' },
                      { key: 'FALHA',        label: '✗ Falhas' },
                      { key: 'REMOCAO',      label: '🗑 Removidas' },
                      { key: 'ARQUIVAMENTO', label: '📦 Arquivadas' },
                      { key: 'DESMARCADA',   label: '↩ Desfeitas' },
                      { key: 'RESTAURADA',   label: '♻ Restauradas' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFiltroLogs(key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                          filtroLogs === key
                            ? 'bg-cyan-500 text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* ── FEED DE EVENTOS ── */}
                  <div className="space-y-2">
                    {logsVisiveis
                      .sort((a, b) => b.id - a.id)
                      .map(log => {
                        const cfg = ACAO_CONFIG[log.action] || {
                          label: log.action, cor: 'text-zinc-400',
                          borda: 'border-zinc-800', fundo: 'bg-zinc-900', Icon: Calendar
                        };
                        const { label, cor, borda, fundo, Icon } = cfg;

                        return (
                          <div
                            key={log.id}
                            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${borda} ${fundo} transition hover:brightness-110`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-lg bg-zinc-950/60 border ${borda} shrink-0`}>
                                <Icon size={16} className={cor} />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  log.action === 'FALHA' || log.action === 'REMOCAO'
                                    ? 'text-zinc-500 line-through'
                                    : 'text-zinc-100'
                                }`}>
                                  {log.title}
                                </p>
                                <p className={`text-xs mt-0.5 font-medium ${cor}`}>
                                  {label}
                                  <span className="text-zinc-600 mx-1.5">·</span>
                                  <span className="text-zinc-500 capitalize">{log.type}</span>
                                </p>
                              </div>
                            </div>

                            {log.action === "CONCLUSAO" && (
                              <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full shrink-0">
                                +{log.xp} XP
                              </span>
                            )}
                            {log.action === "DESMARCADA" && (
                              <span className="text-xs font-black text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1.5 rounded-full shrink-0">
                                {log.xp} XP
                              </span>
                            )}
                          </div>
                        );
                      })}

                    {logsVisiveis.length === 0 && (
                      <p className="text-zinc-600 text-sm text-center py-4 italic">
                        Nenhum evento deste tipo neste dia.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Estado vazio após filtro global */}
        {datasLog.every(data =>
          filtroLogs !== 'todos' && !agrupado[data].some(l => l.action === filtroLogs)
        ) && (
          <div className="text-center py-10 text-zinc-600 text-sm italic">
            Nenhum evento do tipo selecionado encontrado no histórico.
          </div>
        )}
      </div>
    </div>
  );
}

// ===============================
// 📌 RENDER PRINCIPAL
// ===============================
 return (

  <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans selection:bg-cyan-500/30">
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* HEADER */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex justify-between items-start sm:items-center">
          <div className="flex flex-col items-start z-10">
            <p className="text-xs text-zinc-500 font-bold tracking-widest mb-1">CAÇADOR</p>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={20}
                  value={nomeJogador}
                  onChange={(e) => setNomeJogador(e.target.value.toUpperCase())}
                  className="bg-zinc-950/80 text-cyan-400 font-black text-2xl sm:text-3xl px-3 py-1 rounded-lg border border-cyan-500/50 outline-none w-48 sm:w-64 max-w-[60vw] shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:ring-2 focus:ring-cyan-500/40 transition-all"
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
                <button
                  onMouseDown={(e) => { e.preventDefault(); setIsEditingName(false); }}
                  className="bg-green-500/20 text-green-400 p-2 rounded-lg hover:bg-green-500/30 hover:text-green-300 transition-colors shrink-0"
                >
                  <Check size={20} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 cursor-pointer group/name sm:flex-nowrap" onClick={() => setIsEditingName(true)}>
                <h1 className="text-3xl sm:text-4xl text-cyan-400 font-black tracking-tight drop-shadow-md transition-colors group-hover/name:text-cyan-300 truncate max-w-[50vw] sm:max-w-sm">
                  {nomeJogador}
                </h1>
                {nomeJogador === "JOGADOR" ? (
                  <div className="flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-md border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 animate-pulse transition-all group-hover/name:bg-cyan-900/40 shrink-0">
                    <Edit2 size={12} />
                    <span className="text-[10px] font-bold tracking-widest hidden sm:inline">NOMEAR CAÇADOR</span>
                    <span className="text-[10px] font-bold tracking-widest sm:hidden">NOMEAR</span>
                  </div>
                ) : (
                  <div className="opacity-0 group-hover/name:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover/name:translate-x-0 p-1.5 rounded-md text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800/60 shrink-0">
                    <Edit2 size={16} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end z-10 mt-2 sm:mt-0">
            <p className="text-xs text-zinc-500 font-bold tracking-widest mb-1">RANK</p>
            <div className="flex items-center justify-center w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.15)] group-hover:scale-105 transition-transform duration-300">
              <p className="text-3xl text-yellow-400 font-black drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{rank}</p>
            </div>
          </div>
        </div>

        {/* XP */}
        <div className="mt-8 z-10 relative">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-100 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">
              <Zap size={16} className="text-cyan-400" /> Nível {nivel}
            </span>
            <span className="text-zinc-400"><strong className="text-white">{xp}</strong> / {xpNecessario} XP</span>
          </div>

          <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progresso}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZiIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30 animate-[pulse_2s_linear_infinite]" />
            </div>
          </div>

          {/* STATS */}
          <div className="space-y-4 sm:space-y-6 mt-8">
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 sm:p-5 text-center hover:bg-zinc-800/40 transition-colors duration-300 group/stat">
                <CheckCircle2 className="mx-auto text-green-500/80 group-hover/stat:text-green-400 transition-colors mb-2 sm:mb-3 group-hover/stat:scale-110 duration-300" size={28} />
                <p className="text-2xl sm:text-3xl font-black text-white">{tarefasfeitasHoje}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Concluídas Hoje</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 sm:p-5 text-center hover:bg-zinc-800/40 transition-colors duration-300 group/stat">
                <Trophy className="mx-auto text-orange-500/80 group-hover/stat:text-orange-400 transition-colors mb-2 sm:mb-3 group-hover/stat:scale-110 duration-300" size={28} />
                <p className="text-2xl sm:text-3xl font-black text-white">8</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Dias Consecutivos</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 sm:p-5 text-center hover:bg-zinc-800/40 transition-colors duration-300 group/stat col-span-2 sm:col-span-1">
                <Zap className="mx-auto text-yellow-500/80 group-hover/stat:text-yellow-400 transition-colors mb-2 sm:mb-3 group-hover/stat:scale-110 duration-300" size={28} />
                <p className="text-2xl sm:text-3xl font-black text-white">{xpTotal}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">XP Total</p>
              </div>
            </div>

            {/* Pendências por Tipo */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 sm:p-4 text-center overflow-hidden relative cursor-default hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 group/pend">
                <Calendar className="mx-auto text-cyan-500/50 group-hover/pend:text-cyan-400 transition-colors mb-2 group-hover/pend:-translate-y-1 duration-300" size={20} />
                <p className="text-lg sm:text-2xl font-bold text-white">{pendentesDiarias}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 truncate">Diárias</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 sm:p-4 text-center overflow-hidden relative cursor-default hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 group/pend">
                <Target className="mx-auto text-cyan-500/50 group-hover/pend:text-cyan-400 transition-colors mb-2 group-hover/pend:-translate-y-1 duration-300" size={20} />
                <p className="text-lg sm:text-2xl font-bold text-white">{pendentesSemanais}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 truncate">Semanais</p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-3 sm:p-4 text-center overflow-hidden relative cursor-default hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 group/pend">
                <Trophy className="mx-auto text-cyan-500/50 group-hover/pend:text-cyan-400 transition-colors mb-2 group-hover/pend:-translate-y-1 duration-300" size={20} />
                <p className="text-lg sm:text-2xl font-bold text-white">{pendentesObjetivos}</p>
                <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 truncate">Objetivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM E FILTROS */}
      <div className="space-y-4 mt-8">
        {/* ADD TASK FORM */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-2 sm:p-3 flex gap-2 flex-col sm:flex-row shadow-lg focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/40 transition-all duration-300 group">
          <input
            type="text"
            placeholder="Nova missão..."
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
            className="flex-1 bg-zinc-950/50 px-4 py-3 text-white rounded-lg focus:outline-none placeholder:text-zinc-600 transition-colors"
          />

          <div className="flex gap-2">
            <select
              className="flex-1 sm:flex-none bg-zinc-950/50 border-r border-zinc-800 sm:border-none px-4 py-3 text-zinc-300 rounded-lg sm:rounded cursor-pointer focus:outline-none shrink-0 transition-colors hover:text-white"
              value={tipoTarefa}
              onChange={(e) => setTipoTarefa(e.target.value)}
            >
              <option value="diaria">Diária (+{xpPorTIpo.diaria} XP)</option>
              <option value="semanal">Semanal (+{xpPorTIpo.semanal} XP)</option>
              <option value="objetivo">Objetivo (+{xpPorTIpo.objetivo} XP)</option>
            </select>

            <button
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] shrink-0"
              onClick={adicionarTarefa}
            >
              <Plus size={20} strokeWidth={3} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>

        {/* CONTROLES (FILTROS E ABAS) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800/50">
          
          {/* Toggles de Categoria */}
          <div className="flex overflow-x-auto gap-1 pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos', icon: Target },
              { id: 'diaria', label: 'Diárias', icon: Calendar },
              { id: 'semanal', label: 'Semanais', icon: Calendar },
              { id: 'objetivo', label: 'Objetivos', icon: Trophy }
            ].map((f) => (
              <button
                key={f.id}
                className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                  filtro === f.id
                    ? "bg-zinc-800 text-white shadow-md shadow-black/20"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80"
                }`}
                onClick={() => setFiltro(f.id)}
              >
                <f.icon size={16} className={filtro === f.id ? "text-cyan-400" : "opacity-70"} />
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-zinc-800 hidden md:block"></div>

          {/* Sistema e Lixeira */}
          <div className="flex gap-1 shrink-0">
            <button
              className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg ${
                filtro === "arquivadas"
                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  : "text-zinc-500 hover:text-yellow-500/80 hover:bg-yellow-500/5"
              }`}
              onClick={() => setFiltro("arquivadas")}
            >
              <Archive size={16} /> Lixeira
            </button>

            <button
              className={`transition-all duration-300 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg ${
                filtro === "historico"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-zinc-500 hover:text-cyan-400/80 hover:bg-cyan-500/5"
              }`}
              onClick={() => setFiltro("historico")}
            >
              <History size={16} /> Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-4/5 max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {tipoModal === 'remover' ? "Confirmar remoção"
                : tipoModal === 'limpar' ? "Confirmar arquivamento"
                : "Confirmar restauração"}
            </h2>

            <p className="mt-4">
              {tipoModal === 'remover'
                ? "Tem certeza que deseja remover esta tarefa?"
                : tipoModal === 'limpar'
                ? "Deseja arquivar esta tarefa?"
                : "Deseja restaurar esta tarefa?"}
            </p>
            <p className="mb-6">
              {tipoModal === 'remover'
                ? "Não será possível restaurá-la."
                : tipoModal === 'limpar'
                ? "Ela poderá ser restaurada na lixeira."
                : "Ela voltará para a lista principal."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={fecharModal}
                className="px-4 py-2 bg-gray-500/70 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAcaoModal}
                className={`px-4 py-2 text-white rounded ${
                  tipoModal === "remover" ? "bg-red-500 hover:bg-red-600"
                  : tipoModal === 'limpar' ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {tipoModal === 'remover' ? "Remover"
                  : tipoModal === 'limpar' ? "Arquivar"
                  : "Restaurar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASKS OU HISTÓRICO */}
      <div className="space-y-3 mt-6">
        {filtro === "historico" ? (
          renderHistorico()
        ) : (
          <div className="flex flex-col gap-3">
          {tarefaFiltrada.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
              <Target size={48} strokeWidth={1} className="opacity-50" />
              <p className="text-base font-medium">Nenhuma missão encontrada.</p>
              <p className="text-sm">Adicione uma nova ou mude o filtro para ver mais.</p>
            </div>
          ) : (
          tarefaFiltrada.map((item) => {
            const hoje = new Date().toISOString().split("T")[0];

            const ontem = new Date();
            ontem.setDate(ontem.getDate() - 1);
            const dataOntem = ontem.toISOString().split("T")[0];

            const jaFeitaHoje = execucoes.some(
              (e) => e.tarefaId === item.id && e.date === hoje
            );

            const perdeuOntem =
              item.type === "diaria" &&
              falhasDiarias.some(
                (f) => f.tarefaId === item.id && f.date === dataOntem
              );

            const tarefaExpirada =
              item.type === "semanal" &&
              verificarSeExpirou(item.createdAt);

            let diasRestantes = null;

            if (item.type === "semanal" && item.createdAt) {
              const dataCriacao = new Date(item.createdAt);
              const agora = new Date();
              const diasPassados = Math.floor((agora - dataCriacao) / (1000 * 60 * 60 * 24));
              diasRestantes = Math.max(0, 7 - diasPassados);
            }

            const bloqueada = tarefaExpirada || perdeuOntem;
            const arquivada = tarefasOcultas.includes(item.id);

            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between p-4 sm:px-5 sm:py-4 rounded-xl border transition-all duration-300 ${
                  arquivada
                    ? "bg-zinc-900/90 border-zinc-700 border-dashed opacity-100 shadow-none text-zinc-300 hover:bg-zinc-800"
                    : perdeuOntem || tarefaExpirada
                    ? "bg-red-950/10 border-red-900/30 hover:border-red-500/40 hover:bg-red-950/20"
                    : jaFeitaHoje
                    ? "bg-green-950/10 border-green-900/30 hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.05)] text-zinc-400"
                    : "bg-zinc-900/80 border-zinc-800/80 hover:border-cyan-500/40 hover:bg-zinc-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer"
                }`}
                onClick={() => {
                  if (!bloqueada && !arquivada) completarTarefa(item.id);
                }}
              >
                {/* LADO ESQUERDO: Check e Título */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (bloqueada || arquivada) return;
                      completarTarefa(item.id);
                    }}
                    disabled={bloqueada || arquivada}
                    className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 border-2 rounded-full flex items-center justify-center transition-all duration-300 outline-none ${
                      bloqueada || arquivada
                        ? "opacity-40 cursor-not-allowed border-zinc-700 bg-zinc-900"
                        : jaFeitaHoje
                        ? "border-green-500 bg-green-500/20 text-green-400 scale-105 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        : "border-zinc-500 bg-zinc-950 group-hover:border-cyan-400 group-hover:bg-cyan-950/30 text-transparent hover:scale-110 active:scale-90"
                    }`}
                  >
                    <CheckCircle2 size={20} className={jaFeitaHoje ? "opacity-100" : "opacity-0 group-hover:opacity-40 text-cyan-400 transition-opacity"} strokeWidth={3} />
                  </button>

                  <div className="flex flex-col min-w-0">
                    <p className={`font-semibold text-base sm:text-lg truncate transition-colors duration-300 ${
                      arquivada
                        ? "line-through text-zinc-400 opacity-80"
                        : jaFeitaHoje
                        ? "line-through text-zinc-500"
                        : "text-zinc-100 group-hover:text-cyan-50"
                    }`}>
                      {item.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider border bg-zinc-800/50 text-cyan-400 border-zinc-700/50 ${
                        arquivada || jaFeitaHoje ? 'opacity-50' : ''
                      }`}>
                         {item.type}
                      </span>

                      {arquivada && (
                        <span className="text-[10px] sm:text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-zinc-700">
                          <Archive size={10} /> Arquivada
                        </span>
                      )}

                      {!arquivada && (
                        <>
                          {item.type === "diaria" && perdeuOntem && (
                            <span className="text-[10px] sm:text-xs text-red-400 flex items-center gap-1 font-medium bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50">
                              <XCircle size={12}/> Falhou ontem
                            </span>
                          )}
                          {item.type === "diaria" && !perdeuOntem && !jaFeitaHoje && (
                            <span className="text-[10px] sm:text-xs text-zinc-500 font-medium flex items-center gap-1">
                              <Calendar size={12}/> {horas}h {minutos}m restantes
                            </span>
                          )}
                          
                          {item.type === "semanal" && (
                            tarefaExpirada
                              ? <span className="text-[10px] sm:text-xs text-red-400 flex items-center gap-1 font-medium bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50">
                                  <XCircle size={12}/> Expirada
                                </span>
                              : !jaFeitaHoje && <span className="text-[10px] sm:text-xs text-zinc-500 font-medium flex items-center gap-1">
                                  <Calendar size={12}/> {diasRestantes} dias restantes
                                </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* LADO DIREITO: XP e Ações */}
                <div className="flex items-center gap-3 sm:gap-6 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className={`font-black text-base sm:text-xl transition-all duration-300 ${
                    arquivada ? "text-zinc-600" 
                    : jaFeitaHoje ? "text-yellow-600"
                    : "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.2)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                  }`}>
                    +{item.xp} <span className="text-xs opacity-70 font-bold">XP</span>
                  </span>

                  <div className="flex gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    {arquivada ? (
                      <button
                        onClick={() => solicitarAcaoModal(item.id, 'restaurar')}
                        className="p-2 sm:p-2.5 text-zinc-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Restaurar tarefa"
                      >
                        <History size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => solicitarAcaoModal(item.id, 'limpar')}
                        className="p-2 sm:p-2.5 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Arquivar tarefa"
                      >
                        <Archive size={18} />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => solicitarAcaoModal(item.id, 'remover')}
                      className="p-2 sm:p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Apagar permanentemente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
          )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}