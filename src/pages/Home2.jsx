import { Plus, Target, Calendar, Trophy, Zap, CheckCircle2, Trash2, Filter } from "lucide-react";
import React, { useState,useEffect } from 'react'

export default function Home2() {

    const tarefasIniciais = [{
      id: 1,
      title: 'treinar',
      xp: 50,
      completed: false,
      type: 'diaria'
    }]
    
    const [novaTarefa, setNovaTarefa] = useState("")
    const [tipoTarefa, setTipoTarefa] = useState('diaria')
    const [filtro, setFiltro] = useState('todos')
// ===============================
// 📌 ESTADOS COM LOCALSTORAGE (CLEAN CODE)
// ===============================

// Tarefas salvas no navegador
const [tarefa, setTarefa] = useState(() => {
  const tarefasSalvas = localStorage.getItem('tarefas')
  return tarefasSalvas ? JSON.parse(tarefasSalvas) : tarefasIniciais
})

// Nível salvo no navegador
const [nivel, setNivel] = useState(() => {
  const nivelSalvo = localStorage.getItem('nivel')
  return nivelSalvo ? JSON.parse(nivelSalvo) : 1
})

// XP salvo no navegador
const [xp, setXp] = useState(() => {
  const xpSalvo = localStorage.getItem('xp')
  return xpSalvo ? JSON.parse(xpSalvo) : 0
})


// ===============================
// 📌 SALVAR AUTOMATICAMENTE
// ===============================

// Salva tarefas sempre que mudar
useEffect(() => {
  localStorage.setItem('tarefas', JSON.stringify(tarefa))
}, [tarefa])

// Salva nível sempre que mudar
useEffect(() => {
  localStorage.setItem('nivel', JSON.stringify(nivel))
}, [nivel])

// Salva XP sempre que mudar
useEffect(() => {
  localStorage.setItem('xp', JSON.stringify(xp))
}, [xp])

    const xpParaSubir = (nivel) => nivel * 200

    const xpNecessario = xpParaSubir(nivel);
    const progresso = (xp / xpNecessario) * 100;
    
    const rank =
      nivel < 10 ? "E" :
      nivel < 20 ? "D" :
      nivel < 30 ? "C" : "B";

    const ganharXp = (ganhoXp) => {
      const novoXp = xp + ganhoXp
      const xpNecessario = xpParaSubir(nivel)

      if (novoXp >= xpNecessario) {
        setNivel(nivel + 1)

        const xpRestante = novoXp - xpNecessario
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
          completed: false,
          type: tipoTarefa
        }
      ])

      setNovaTarefa("")
    }

    const compleetarTarefa = (id) => {
      // ❌ find errado → não existe sozinho
      // ✅ correto:
      const tarefaEncontrada = tarefa.find((t) => t.id === id)

      if (!tarefaEncontrada || tarefaEncontrada.completed) return

      ganharXp(tarefaEncontrada.xp)

      setTarefa(
        tarefa.map(t =>
          t.id === id
            ? { ...t, completed: true }
            : t
        )
      )
    }


    const deletarTarefa  = (id) => {
       setTarefa(tarefa.filter(t => t.id !== id))
    }

    const tarefaFiltrada = 
      filtro == 'todos' ? tarefa :
      tarefa.filter((t) => t.type === filtro)


   const xpTotal = tarefa.filter(item => item.completed).reduce((total, t) => total + t.xp, 0)   
    
  return (
    <div className='min-h-screen bg-zinc-950 text-white p-6 '>
         
      <div className='max-w-4xl mx-auto space-y-6'>
 
        {/* HEADER */}
        <div className='bg-zinc-900 rounded-xl border border-cyan-500/20 p-6'>
            
          <div className='flex justify-between items-center'>

            <div className='flex flex-col items-start'>
              <p className='text-xs text-zinc-400'>CAÇADOR</p>
              <h1 className='text-2xl text-cyan-400 font-bold'>JOGADOR</h1>
            </div>
              
            <div className='flex flex-col items-end'>
              <p className='text-xs text-zinc-400'>RANK</p>
              <p className='text-xl text-yellow-400 font-bold'>{rank}</p>
            </div>

          </div>

          {/* XP */}
          <div className='mt-4'>
            <div className='flex justify-between text-sm mb-1'>
              <span><Zap size={16}/> Nivel {nivel}</span> 
              <span>{xp} / {xpNecessario}</span>
            </div>

            <div className='w-full h-2 bg-zinc-800 rounded-full'>
              <div
                className='h-2 bg-cyan-500 rounded-full transition-all'
                style={{ width: `${progresso}%` }}
              />
            </div>

            {/* STATS */}
            <div className='grid grid-cols-3 gap-4 mt-4 text-center'>
              <div>
                <p>{tarefa.filter((t) => t.completed).length}</p>
                <p>Completas</p>
              </div>

              <div>
                <p>{tarefa.filter((t) => t.completed == false).length}</p>
                <p>Pendentes</p>
              </div>

              <div>
                <p>{xpTotal}</p>
                <p>XP Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className='bg-zinc-900 rounded-xl p-4 flex gap-2 flex-col sm:flex-row'>
          <input
            type="text"
            placeholder='Nova missão..'
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            className='flex-1 bg-zinc-800 px-4 py-2 text-white rounded'
          />
              
          <select
            className='bg-zinc-800 px-3 py-2 text-zinc-100'
            value={tipoTarefa}
            onChange={(e) => setTipoTarefa(e.target.value)}
          >
            <option value='diaria'>Diaria</option>
            <option value="semanal">Semanal</option>
            <option value="objetivo">Objetivo</option>
          </select>
    
          <button
            className='bg-cyan-500 rounded px-3 py-2 flex items-center'
            onClick={adicionarTarefa}
          >
            <Plus /> Add
          </button>
        </div>
 
        {/* FILTROS */}
        <div className='mt-2 flex gap-3'>
          <button
            className='bg-zinc-800 flex rounded gap-1 text-white items-center px-3 py-1'
            onClick={() => setFiltro('todos')}
          >
            <Target size={14} /> Todos
          </button>

          <button className='bg-zinc-800 flex rounded gap-1 text-white items-center px-3 py-1'
           onClick={() => setFiltro('diaria')}> 
            <Calendar size={14} />Díaria
          </button>

          <button className='bg-zinc-800 flex rounded gap-1 text-white items-center px-3 py-1'
           onClick={() => setFiltro('semanal')}>
            <Calendar size={14} /> Semanais
          </button>

          <button className='bg-zinc-800 flex rounded gap-1 text-white items-center px-3 py-1'
           onClick={() => setFiltro('objetivo')}>
            <Trophy size={14} /> Objetivo
          </button>
        </div>

        {/* TASKS */}
       <div className="space-y-3">
       {tarefaFiltrada.map((item) => (
       <div
        key={item.id}
        className="bg-zinc-900 flex justify-between py-3 px-3 items-center rounded"
        >
      
      {/* LADO ESQUERDO */}
      <div className="flex items-center gap-3">

        {/* BOTÃO DE COMPLETAR */}
        <button
           onClick={() => compleetarTarefa(item.id)}
          className="w-8 h-8 border rounded-full flex items-center justify-center"
        >
          {item.completed && <CheckCircle2 size={18} />}
        </button>

        {/* TEXTO */}
        <div>
          <p className={item.completed ? "line-through" : ""}>
            {item.title}
          </p>
          <p className="text-xs text-zinc-400">
            {item.type}
          </p>
        </div>

        </div>

      {/* LADO DIREITO */}
        <div className="flex items-center gap-4">
        <span className="text-yellow-400 font-bold">
          +{item.xp}
        </span>

        <button onClick={() => deletarTarefa(item.id)}>
          <Trash2 size={18} />
        </button>
        </div>

           </div>
           ))}
      </div>

      </div>   
    </div>
  )
}