import { useState } from "react";
import { Plus, Target, Calendar, Trophy, Zap, CheckCircle2, Trash2 } from "lucide-react";

// ===== DADOS INICIAIS =====
const tarefasIniciais = [
  { id: 1, title: "Acordar às 6h", xp: 50, completed: false, type: "daily" },
  { id: 2, title: "Exercício 30min", xp: 100, completed: false, type: "daily" },
  { id: 3, title: "Ler 20 páginas", xp: 75, completed: false, type: "weekly" },
  { id: 4, title: "Completar curso", xp: 500, completed: false, type: "goal" },
];

const xpParaSubir = (nivel) => nivel * 200;

export default function Home() {

  // ===== ESTADOS =====
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [nivel, setNivel] = useState(1);
  const [xp, setXp] = useState(0);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tipoTarefa, setTipoTarefa] = useState("daily");
  const [filtro, setFiltro] = useState("all");

  // ===== FUNÇÕES =====
  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;

    const xpRecompensa =
      tipoTarefa === "goal" ? 200 :
      tipoTarefa === "weekly" ? 100 : 50;

    setTarefas([
      ...tarefas,
      {
        id: Date.now(),
        title: novaTarefa,
        xp: xpRecompensa,
        completed: false,
        type: tipoTarefa
      }
    ]);

    setNovaTarefa("");
  };
 
  const completarTarefa = (id) => {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa || tarefa.completed) return;

    const novoXp = xp + tarefa.xp;
    const xpNecessario = xpParaSubir(nivel);

    if (novoXp >= xpNecessario) {
      setNivel(nivel + 1);
      setXp(novoXp - xpNecessario);
    } else {
      setXp(novoXp);
    }

    setTarefas(
      tarefas.map(t =>
        t.id === id ? { ...t, completed: true } : t
      )
    );
  };

  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  // ===== CÁLCULOS =====
  const tarefasFiltradas =
    filtro === "all" ? tarefas : tarefas.filter(t => t.type === filtro);

  const xpNecessario = xpParaSubir(nivel);
  const progressoXp = (xp / xpNecessario) * 100;

  const rank =
    nivel < 10 ? "E" :
    nivel < 20 ? "D" :
    nivel < 30 ? "C" : "B";

  // ===== UI =====
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-cyan-500/20">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs text-zinc-400">CAÇADOR</p>
              <h1 className="text-2xl font-bold text-cyan-400">JOGADOR</h1>
            </div>

            <div className="text-right">
              <p className="text-xs text-zinc-400">RANK</p>
              <p className="text-xl font-bold text-yellow-400">{rank}</p>
            </div>
          </div>

          {/* XP */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <Zap size={16} /> Nível {nivel}
              </span>
              <span>{xp} / {xpNecessario}</span>
            </div>

            <div className="w-full h-2 bg-zinc-800 rounded-full">
              <div
                className="h-2 bg-cyan-500 rounded-full transition-all"
                style={{ width: `${progressoXp}%` }}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <p className="text-xl font-bold">
                {tarefas.filter(t => t.completed).length}
              </p>
              <p className="text-xs text-zinc-400">Completas</p>
            </div>

            <div>
              <p className="text-xl font-bold">
                {tarefas.filter(t => !t.completed).length}
              </p>
              <p className="text-xs text-zinc-400">Pendentes</p>
            </div>

            <div>
              <p className="text-xl font-bold">
                {tarefas.reduce((acc, t) => t.completed ? acc + t.xp : acc, 0)}
              </p>
              <p className="text-xs text-zinc-400">XP Total</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-zinc-900 rounded-xl p-4 flex gap-2 flex-col sm:flex-row">
          <input
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
            placeholder="Nova missão..."
            className="flex-1 bg-zinc-800 px-4 py-2 rounded text-white"
          />

          <select
            value={tipoTarefa}
            onChange={(e) => setTipoTarefa(e.target.value)}
            className="bg-zinc-800 px-3 py-2 rounded"
          >
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="goal">Objetivo</option>
          </select>

          <button
            onClick={adicionarTarefa}
            className="bg-cyan-500 px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todas", icon: Target },
            { key: "daily", label: "Diárias", icon: Calendar },
            { key: "weekly", label: "Semanais", icon: Calendar },
            { key: "goal", label: "Objetivos", icon: Trophy },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={`px-3 py-1 rounded flex items-center gap-1 ${
                filtro === key
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* TASKS */}
        <div className="space-y-3">
          {tarefasFiltradas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="bg-zinc-900 p-4 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-3">

                <button
                  onClick={() => completarTarefa(tarefa.id)}
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                >
                  {tarefa.completed && <CheckCircle2 size={18} />}
                </button>

                <div>
                  <p className={tarefa.completed ? "line-through" : ""}>
                    {tarefa.title}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {tarefa.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-yellow-400 font-bold">
                  +{tarefa.xp}
                </span>

                <button onClick={() => deletarTarefa(tarefa.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}