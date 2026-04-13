import { Zap, CheckCircle2, Trophy, Calendar, Target } from "lucide-react";

export function HeaderStats({ rank, nivel, xp, xpNecessario, progresso, stats }) {
  return (
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

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="flex items-center gap-1"><Zap size={16} /> Nível {nivel}</span>
          <span>{xp} / {xpNecessario}</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full">
          <div className="h-2 bg-cyan-500 rounded-full transition-all" style={{ width: `${progresso}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard icon={<CheckCircle2 className="text-green-400" />} value={stats.feitasHoje} label="Completas Hoje" />
          <StatCard icon={<Trophy className="text-orange-400" />} value="8" label="Dias Consecutivos" />
          <StatCard icon={<Zap className="text-yellow-400" />} value={stats.xpTotal} label="XP Total" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <MiniStatCard icon={<Calendar className="text-cyan-400" />} value={stats.pendentesDiarias} label="Diárias" />
          <MiniStatCard icon={<Target className="text-purple-400" />} value={stats.pendentesSemanais} label="Semanais" />
          <MiniStatCard icon={<Trophy className="text-pink-400" />} value={stats.pendentesObjetivos} label="Objetivos" />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, value, label }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center shadow">
    {icon}
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-zinc-400 uppercase tracking-wide">{label}</p>
  </div>
);

const MiniStatCard = ({ icon, value, label }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
    {icon}
    <p className="text-xl font-semibold">{value}</p>
    <p className="text-xs text-zinc-400">{label} Pendentes</p>
  </div>
);