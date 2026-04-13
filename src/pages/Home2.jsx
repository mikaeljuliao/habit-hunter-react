import { Plus, Target, Calendar, Trophy, Zap, CheckCircle2, Trash2, ChevronDown, ChevronRight, XCircle, Archive, History } from "lucide-react";
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

          // Stats do dia (sempre usando todos os logs do dia, sem filtro global)
          const logsCompletoDia = logsDoDia.filter(l => l.action !== 'CRIACAO');
          const xpDia           = logsCompletoDia.filter(l => l.action === "CONCLUSAO").reduce((s, l) => s + l.xp, 0);
          const concluidasDia   = logsCompletoDia.filter(l => l.action === "CONCLUSAO").length;
          const falhasDia       = logsCompletoDia.filter(l => l.action === "FALHA").length;
          const removidosDia    = logsCompletoDia.filter(l => l.action === "REMOCAO").length;
          const arquivadosDia   = logsCompletoDia.filter(l => l.action === "ARQUIVAMENTO").length;

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

                  {/* ── RESUMO RÁPIDO DO DIA ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-lg font-black text-yellow-400">{xpDia > 0 ? `+${xpDia}` : 0}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">XP no dia</p>
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
                      <p className="text-lg font-black text-zinc-400">{removidosDia + arquivadosDia}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Removidas/Arq.</p>
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

  <div className="min-h-screen bg-zinc-950 text-white p-6">
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-zinc-900 rounded-xl border border-cyan-500/20 p-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start">
            <p className="text-xs text-zinc-400">CAÇADOR</p>
            <h1 className="text-2xl text-cyan-400 font-bold">JOGADOR</h1>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs text-zinc-400">RANK</p>
            <p className="text-xl text-yellow-400 font-bold">{rank}</p>
          </div>
        </div>

        {/* XP */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Zap size={16} /> Nível {nivel}
            </span>
            <span>{xp} / {xpNecessario}</span>
          </div>

          <div className="w-full h-2 bg-zinc-800 rounded-full">
            <div
              className="h-2 bg-cyan-500 rounded-full transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>

          {/* STATS */}
          <div className="space-y-6 my-6">
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center shadow">
                <CheckCircle2 className="mx-auto text-green-400 mb-2" size={24} />
                <p className="text-2xl font-bold">{tarefasfeitasHoje}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">
                  Completas Hoje
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center shadow">
                <Trophy className="mx-auto text-orange-400 mb-2" size={24} />
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">
                  Dias Consecutivos
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center shadow">
                <Zap className="mx-auto text-yellow-400 mb-2" size={24} />
                <p className="text-2xl font-bold">{xpTotal}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">
                  XP Total
                </p>
              </div>
            </div>

            {/* Pendências por Tipo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
                <Calendar className="mx-auto text-cyan-400 mb-2" size={22} />
                <p className="text-xl font-semibold">{pendentesDiarias}</p>
                <p className="text-xs text-zinc-400">Diárias Pendentes</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
                <Target className="mx-auto text-purple-400 mb-2" size={22} />
                <p className="text-xl font-semibold">{pendentesSemanais}</p>
                <p className="text-xs text-zinc-400">Semanais Pendentes</p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
                <Trophy className="mx-auto text-pink-400 mb-2" size={22} />
                <p className="text-xl font-semibold">{pendentesObjetivos}</p>
                <p className="text-xs text-zinc-400">Objetivos Pendentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-zinc-900 rounded-xl p-4 flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Nova missão..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          className="flex-1 bg-zinc-800 px-4 py-2 text-white rounded"
        />

        <select
          className="bg-zinc-800 px-3 py-2 text-zinc-100"
          value={tipoTarefa}
          onChange={(e) => setTipoTarefa(e.target.value)}
        >
          <option value="diaria">Diária (+{xpPorTIpo.diaria} XP)</option>
          <option value="semanal">Semanal (+{xpPorTIpo.semanal} XP)</option>
          <option value="objetivo">Objetivo (+{xpPorTIpo.objetivo} XP)</option>
        </select>

        <button
          className="bg-cyan-500 hover:bg-cyan-600 transition rounded px-3 py-2 flex items-center justify-center"
          onClick={adicionarTarefa}
        >
          <Plus />
        </button>
      </div>

      {/* FILTROS */}
      <div className="mt-2 flex flex-wrap gap-3">
        <button
          className="bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1"
          onClick={() => setFiltro("todos")}
        >
          <Target size={14} /> Todos
        </button>

        <button
          className="bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1"
          onClick={() => setFiltro("diaria")}
        >
          <Calendar size={14} /> Diárias
        </button>

        <button
          className="bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1"
          onClick={() => setFiltro("semanal")}
        >
          <Calendar size={14} /> Semanais
        </button>

        <button
          className="bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1"
          onClick={() => setFiltro("objetivo")}
        >
          <Trophy size={14} /> Objetivos
        </button>
      </div>

      {/* ABAS: Lixeira e Histórico */}
      <div className="flex gap-3">
        <button
          className={`transition flex rounded gap-1 items-center px-3 py-1 ${
            filtro === "arquivadas"
              ? "bg-cyan-500 text-black font-semibold"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
          onClick={() => setFiltro("arquivadas")}
        >
          <Archive size={14} /> Lixeira
        </button>

        <button
          className={`transition flex rounded gap-1 items-center px-3 py-1 ${
            filtro === "historico"
              ? "bg-cyan-500 text-black font-semibold"
              : "bg-zinc-800 text-cyan-400 hover:bg-zinc-700"
          }`}
          onClick={() => setFiltro("historico")}
        >
          <History size={14} /> Histórico
        </button>
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
      <div className="space-y-3">
        {filtro === "historico" ? (
          renderHistorico()
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
                    <p className={`font-medium ${
                      arquivada
                        ? "line-through text-gray-400"
                        : jaFeitaHoje
                        ? "line-through text-zinc-400"
                        : ""
                    }`}>
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
                          <p className="text-xs text-zinc-400 mt-1">⏳ Termina em: {horas}h {minutos}m</p>
                        )}
                      </>
                    )}

                    {/* SEMANAL */}
                    {item.type === "semanal" && !arquivada && (
                      tarefaExpirada
                        ? <p className="text-xs text-red-400">❌ Expirada</p>
                        : <p className="text-xs text-zinc-400">⏳ {diasRestantes} dias restantes</p>
                    )}

                    {/* OBJETIVO */}
                    {item.type === "objetivo" && !arquivada && (
                      <p className="text-xs text-zinc-400">Objetivo livre (sem prazo)</p>
                    )}
                  </div>
                </div>

                {/* LADO DIREITO */}
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${arquivada ? "text-gray-400" : "text-yellow-400"}`}>
                    +{item.xp}
                  </span>

                  <button onClick={() => solicitarAcaoModal(item.id, 'remover')}>
                    <Trash2 size={18} />
                  </button>

                  {arquivada ? (
                    <button
                      onClick={() => solicitarAcaoModal(item.id, 'restaurar')}
                      className="text-green-400 hover:text-green-300 transition"
                      title="Restaurar tarefa"
                    >
                      <Archive size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => solicitarAcaoModal(item.id, 'limpar')}
                      className="text-zinc-400 hover:text-white transition"
                      title="Arquivar tarefa"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
);
}