import { Plus, Target, Calendar, Trophy, Zap, CheckCircle2, Trash2, Filter, ChevronDown, ChevronRight, XCircle, Archive, History } from "lucide-react";
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
const [filtroHistorico, setFiltroHistorico] = useState('todos')
const [mostrarModal, setMostrarModal] = useState(false)
const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
const [tipoModal, setTipoModal] = useState(null)
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
  
  const data = new Date();
  data.setDate(data.getDate() - 1);
  const ontem = data.toISOString().split("T")[0];
  data.setDate(data.getDate() - 1);
  const anteontem = data.toISOString().split("T")[0];
  data.setDate(data.getDate() - 1);
  const tresDiasAtras = data.toISOString().split("T")[0];
  
  return [
     { id: 101, action: "CRIACAO", date: tresDiasAtras, title: "Pagar Contas", type: "diaria", xp: 0 },
     { id: 102, action: "CONCLUSAO", date: tresDiasAtras, title: "Ler 20 páginas", type: "diaria", xp: 50 },
     { id: 103, action: "CRIACAO", date: anteontem, title: "Revisar Projeto", type: "semanal", xp: 0 },
     { id: 104, action: "ARQUIVAMENTO", date: anteontem, title: "Projeto Parado", type: "objetivo", xp: 0 },
     { id: 105, action: "FALHA", date: ontem, title: "Ir na Academia", type: "diaria", xp: 0 },
     { id: 106, action: "REMOCAO", date: ontem, title: "Tarefa Errada", type: "diaria", xp: 0 },
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
    .filter(t => !execucoes.some(
      e => e.tarefaId === t.id && e.date === dataOntem
    ))
    .map(t => ({
      tarefaId: t.id,
      date: dataOntem
    }))

  const novasFalhas = falhas.filter(f => !falhasDiarias.some(p => p.tarefaId === f.tarefaId && p.date === f.date));

  if (novasFalhas.length > 0) {
    setFalhasDiarias(prev => [...prev, ...novasFalhas])
    
    // Injeção nos logs globais:
    const novosLogs = novasFalhas.map(f => {
       const t = tarefa.find(x => x.id === f.tarefaId);
       return { id: Date.now() + Math.random(), action: "FALHA", date: dataOntem, title: t ? t.title : "Desconhecido", type: t ? t.type : "diaria", xp: 0 };
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
    setExecucoes(
      execucoes.filter(
        (e) => !(e.tarefaId === id && e.date === hoje)
      )
    )
    setXp((prev) => Math.max(0, prev - tarefaEncontrada.xp))
    registrarEvento("DESMARCADA", tarefaEncontrada.title, tarefaEncontrada.type, -tarefaEncontrada.xp);
    return
  }

  ganharXp(tarefaEncontrada.xp)

  setExecucoes([
    ...execucoes,
    {
      tarefaId: id,
      date: hoje,
      xp: tarefaEncontrada.xp
    }
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

  const diasPassados = Math.floor(
    (agora - dataCriacao) / MS_POR_DIA
  )

  return diasPassados >= DIAS_LIMITE
}

 const limparTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) registrarEvento("ARQUIVAMENTO", t.title, t.type, 0);
  
  setTarefasOcultas((tarefasAnteriores) =>
    tarefasAnteriores.includes(id) ? tarefasAnteriores : [...tarefasAnteriores, id]
  );
};


const solicitarAcaoModal = (id, tipoDoModal) =>{
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
  if (tarefaSelecionadaId == null) return; // cobre null e undefined
  
    if(tipoModal === 'remover'){
      deletarTarefa(tarefaSelecionadaId)
    } else if( tipoModal === 'limpar'){
      limparTarefa(tarefaSelecionadaId)
    } else if( tipoModal === 'restaurar') {
      restaurarTarefa(tarefaSelecionadaId)
    }
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
      : tarefa.filter(
          (t) =>
            t.type === filtro && !tarefasOcultas.includes(t.id)
        );
  

      const restaurarTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) registrarEvento("RESTAURADA", t.title, t.type, 0);
  
  setTarefasOcultas((prev) =>
    prev.filter((tarefaId) => tarefaId !== id)
  );
};


const xpTotal = execucoes.reduce((total, t) => total + t.xp, 0)

const xpPorTIpo = {
  diaria: 50,
  semanal: 200,
  objetivo: 500
}

const hoje = new Date().toISOString().split("T")[0]

const tarefasfeitasHoje = execucoes.filter(
  (e) => e.date === hoje
).length

const pendentesDiarias = tarefa.filter((t) =>
  t.type === 'diaria' &&
  !execucoes.some(
    (e) => e.tarefaId === t.id && e.date === hoje
  )
).length

const pendentesSemanais = tarefa.filter((t) =>
  t.type === 'semanal' &&
  !verificarSeExpirou(t.createdAt) &&
  !execucoes.some((e) => e.tarefaId === t.id)
).length

const pendentesObjetivos = tarefa.filter((t) =>
  t.type === 'objetivo' &&
  !execucoes.some((e) => e.tarefaId === t.id)
).length

// ===============================
// 📌 CONTAGEM DE TEMPO RESTANTE DO DIA
// ===============================
const agora = new Date()
const fimDoDia = new Date()
fimDoDia.setHours(23, 59, 59, 999)

const tempoRestante = fimDoDia - agora

const horas = Math.floor(tempoRestante / (1000 * 60 * 60))
const minutos = Math.floor(
  (tem// ===============================
// 📌 MULTI-UI RENDER: HISTÓRICO AVANÇADO ACCORDION
// ===============================
const renderHistorico = () => {
    const agrupado = logEventos.reduce((acc, log) => {
        if (!acc[log.date]) acc[log.date] = [];
        acc[log.date].push(log);
        return acc;
    }, {});

    const datasLog = Object.keys(agrupado).sort((a,b) => new Date(b) - new Date(a));

    if (datasLog.length === 0) {
        return <div className="text-center py-10 text-zinc-500">Nenhum evento registrado ainda.</div>
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header explicativo do Histórico Geral */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-center">
               <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-full">
                 <History size={30} />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-white">Histórico e Eventos</h2>
                 <p className="text-sm text-zinc-400">Clique nas datas abaixo para expandir e investigar tudo que aconteceu (adições, falhas, conclusões e muito mais).</p>
               </div>
            </div>

            {datasLog.map(data => {
                const logsDoDia = agrupado[data];
                const partes = data.split("-");
                const fData = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
                
                const xpNoDia = logsDoDia.filter(l => l.action === "CONCLUSAO").reduce((sum, l) => sum + l.xp, 0);
                const isExpanded = data === dataExpandida;

                return (
                    <div key={data} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow">
                        <button 
                            className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-zinc-800/80 transition-colors"
                            onClick={() => setDataExpandida(isExpanded ? null : data)}
                        >
                             <div className="flex items-center gap-3">
                                 {isExpanded ? <ChevronDown size={22} className="text-cyan-400" /> : <ChevronRight size={22} className="text-zinc-500" />}
                                 <h3 className="font-bold text-lg text-white">
                                     {data === hoje ? "Hoje" : fData}
                                 </h3>
                             </div>
                             <div className="flex gap-4 items-center">
                                 {xpNoDia > 0 && <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-1 rounded">+{xpNoDia} XP GANHO NO DIA</span>}
                                 <span className="text-xs font-semibold text-zinc-500">{logsDoDia.length} Registro(s)</span>
                             </div>
                        </button>
                        
                        {isExpanded && (
                            <div className="px-5 pb-5 pt-3 border-t border-zinc-800 bg-zinc-950/40">
                                {/* Filtros internos do dia (Todos, Conclusão, Adição, etc) */}
                                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 custom-scrollbar">
                                    {['todos', 'CRIACAO', 'CONCLUSAO', 'FALHA', 'REMOCAO', 'ARQUIVAMENTO'].map(tf => (
                                        <button 
                                            key={tf}
                                            onClick={() => setFiltroLogs(tf)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                                                filtroLogs === tf 
                                                ? 'bg-cyan-500 text-black' 
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                            }`}
                                        >
                                            {tf === 'todos' ? 'Mostrar Tudo' : tf}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    {logsDoDia
                                        .filter(l => filtroLogs === 'todos' || l.action === filtroLogs)
                                        .sort((a,b) => b.id - a.id) // Ordena pelo MS aleatorio/ID para garantir decrescente no dia
                                        .map(log => {
                                            let Icon = Calendar;
                                            let color = "text-zinc-400";
                                            let border = "border-zinc-800";
                                            let labelAction = log.action;
                                            
                                            // Decoradores baseados na ação
                                            if (log.action === "CRIACAO") { Icon = Plus; color = "text-blue-400"; labelAction = "Nova Missão Criada"; border = "border-blue-900/30"; }
                                            if (log.action === "CONCLUSAO") { Icon = CheckCircle2; color = "text-green-400"; labelAction = "Missão Cumprida"; border = "border-green-900/40"; }
                                            if (log.action === "FALHA") { Icon = XCircle; color = "text-red-500"; labelAction = "Falha Registrada"; border = "border-red-900/40"; }
                                            if (log.action === "REMOCAO") { Icon = Trash2; color = "text-red-400"; labelAction = "Deletada Definitivo"; border = "border-red-900/30"; }
                                            if (log.action === "ARQUIVAMENTO") { Icon = Archive; color = "text-yellow-500"; labelAction = "Enviada p/ Lixeira"; border = "border-yellow-900/30"; }
                                            if (log.action === "DESMARCADA") { Icon = XCircle; color = "text-orange-500"; labelAction = "Status 'Completa' Removido"; }
                                            if (log.action === "RESTAURADA") { Icon = Target; color = "text-cyan-400"; labelAction = "Tirada da Lixeira"; }

                                            return (
                                                <div key={log.id} className={`flex justify-between items-center p-4 rounded-xl border ${border} bg-zinc-900 hover:bg-zinc-800/80 transition`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-full bg-zinc-950 border ${border}`}>
                                                           <Icon size={20} className={color} />
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold text-base sm:text-lg ${log.action === "FALHA" || log.action === "REMOCAO" ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                                                                {log.title}
                                                            </p>
                                                            <p className={`text-xs uppercase font-semibold mt-1 tracking-wider ${color}`}>
                                                                {labelAction} <span className="text-zinc-600 px-1">|</span> <span className="text-zinc-500">{log.type}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {log.action === "CONCLUSAO" && (
                                                        <span className="text-sm border border-yellow-500/20 shadow-inner font-black text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full">+{log.xp} XP</span>
                                                    )}
                                                    {log.action === "DESMARCADA" && (
                                                        <span className="text-sm font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full">{log.xp} XP</span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        
                                        {/* Caso tente filtrar e dê vazio */}
                                        {logsDoDia.filter(l => filtroLogs === 'todos' || l.action === filtroLogs).length === 0 && (
                                            <p className="text-zinc-500 text-center py-6 text-sm italic">O filtro selecionado não possui eventos registrados neste dia.</p>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
          );
        })}
      </div>
    </div>
  );
};

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

       {/* Novas abas de sistema: Lixeira e Histórico */}
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-4/2">
      <h2 className="text-lg font-semibold mb-4">
    {tipoModal === 'remover'
    ? "Confirmar remoção"
    : tipoModal === 'limpar'
    ? "Confirmar arquivamento"
    : "Confirmar restauração"}
    </h2>

      <p className="mt-4">
        {tipoModal === 'remover' ? 
        "Tem certeza que deseja remover esta tarefa?" :
        tipoModal === 'limpar' ?
        "Deseja arquivar esta tarefa?" :
         "Deseja restaurar esta tarefa?" }
      </p>
      <p className="mb-6"> {tipoModal === 'remover' ?
      "Não será possível restaurá-la."  :
      tipoModal === 'limpar' ?
      "Ela poderá ser restaurada na lixeira." :
     "Ela voltará para a lista principal." }</p>
    
      

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
            tipoModal === "remover"
              ? "bg-red-500 hover:bg-red-600" :
              tipoModal === 'limpar' ?
               "bg-yellow-500 hover:bg-yellow-600" :
               'bg-green-500   hover:bg-green-600'
          }`}
        >
         {tipoModal === 'remover' ?
        "Remover" :
        tipoModal === 'limpar' ?
         "Arquivar"  :
         "Restaurar" }
        </button>
      </div>
    </div>
  </div>
)}

      {/* TASKS OU HISTORICO */}
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

            const diasPassados = Math.floor(
              (agora - dataCriacao) / (1000 * 60 * 60 * 24)
            );

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
        {/* Título com texto riscado se arquivada */}
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

        {/* Badge indicativo de arquivamento */}
        {arquivada && (
          <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded w-fit mt-1 flex items-center gap-1">
            <Archive size={12} className="text-gray-300" />
            Arquivada
          </span>
        )}

        <p className="text-xs text-yellow-400">
          Missão: {item.type}
        </p>

        {/* DIÁRIA */}
        {item.type === "diaria" && (
          <>
            {perdeuOntem && !arquivada && (
              <p className="text-xs text-red-400">
                ❌ Falhou ontem
              </p>
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
          <p className="text-xs text-zinc-400">
            Objetivo livre (sem prazo)
          </p>
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

      {/* Botão de Arquivar ou Restaurar */}
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