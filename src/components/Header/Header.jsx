import React, { useState } from "react";
import { Zap, CheckCircle2, Trophy, Calendar, Target, Edit2, Check } from "lucide-react";

export function HeaderStats({ rank, nivel, xp, xpNecessario, progresso, stats, nomeJogador, setNomeJogador }) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 p-6 overflow-hidden group/header shadow-2xl">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover/header:bg-cyan-500/20 transition-colors duration-700" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div className="flex flex-col items-start">
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mb-1">CAÇADOR</p>
          
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

        <div className="flex flex-col items-end">
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mb-1">RANK</p>
          <div className="flex items-center justify-center w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.15)] group-hover/header:rotate-6 transition-all duration-500">
            <p className="text-3xl text-yellow-400 font-black drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{rank}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <div className="flex justify-between text-xs mb-2 font-bold tracking-wider">
          <span className="flex items-center gap-1.5 text-cyan-100 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50 uppercase">
            <Zap size={14} className="text-cyan-400" /> Nível {nivel}
          </span>
          <span className="text-zinc-500"><strong className="text-white text-sm">{xp}</strong> / {xpNecessario} XP</span>
        </div>

        <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progresso}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZiIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
          <StatCard 
            icon={<CheckCircle2 className="text-green-500/80 group-hover/stat:text-green-400" size={24} />} 
            value={stats.feitasHoje} 
            label="Concluídas Hoje" 
          />
          <StatCard 
            icon={<Trophy className="text-orange-500/80 group-hover/stat:text-orange-400" size={24} />} 
            value="8" 
            label="Dias Seguidos" 
          />
          <StatCard 
            icon={<Zap className="text-yellow-500/80 group-hover/stat:text-yellow-400" size={24} />} 
            value={stats.xpTotal} 
            label="XP Total" 
            className="col-span-2 sm:col-span-1"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
          <MiniStatCard icon={<Calendar size={18} />} value={stats.pendentesDiarias} label="Diárias" />
          <MiniStatCard icon={<Target size={18} />} value={stats.pendentesSemanais} label="Semanais" />
          <MiniStatCard icon={<Trophy size={18} />} value={stats.pendentesObjetivos} label="Objetivos" />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, value, label, className = "" }) => (
  <div className={`bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 text-center hover:bg-zinc-800/40 transition-all duration-300 group/stat ${className}`}>
    <div className="mb-2 transition-transform duration-300 group-hover/stat:scale-110 flex justify-center">
      {icon}
    </div>
    <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const MiniStatCard = ({ icon, value, label }) => (
  <div className="bg-zinc-950/20 border border-zinc-800/40 rounded-xl p-3 text-center hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 group/mini">
    <div className="text-cyan-500/50 group-hover/mini:text-cyan-400 transition-colors mb-1.5 flex justify-center group-hover/mini:-translate-y-0.5 duration-300">
      {icon}
    </div>
    <p className="text-lg sm:text-2xl font-bold text-white leading-none">{value}</p>
    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight mt-1 truncate">{label}</p>
  </div>
);