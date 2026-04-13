import React, { useState, useEffect } from "react";
import { Archive } from "lucide-react";
import { HeaderStats } from "../components/Header/Header";
import { FormularioTarefa } from "../components/FormularioTarefa/FormularioTarefa";
import Filtros from "../components/Filtros/Filtros";
import { ListaTarefas } from "../components/ListaTarefas/ListaTarefas";
import ModalConfirmacao from "../components/ModalConfirmacao/ModalConfirmacao";
import ModalSemanal from "../components/ModalSemanal/ModalSemanal";

// ===============================
// 📌 CONSTANTES
// ===============================
const tarefasIniciais = [
  {
    id: 1,
    title: "treinar",
    xp: 50,
    type: "diaria",
    createdAt: new Date().toISOString(),
  },
];

const xpPorTIpo = {
  diaria: 50,
  semanal: 200,
  objetivo: 500,
};

export default function Home() {
  // ===============================
  // 📌 ESTADOS PRINCIPAIS
  // ===============================
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tipoTarefa, setTipoTarefa] = useState("diaria");
  const [filtro, setFiltro] = useState("todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSemanal, setMostrarModalSemanal] = useState(false);
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
  const [tipoModal, setTipoModal] = useState(null);
  const [tarefaPendente, setTarefaPendente] = useState(null);

  // ===============================
  // 📌 ESTADOS COM LOCALSTORAGE
  // ===============================
  const [tarefa, setTarefa] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : tarefasIniciais;
  });

  const [nivel, setNivel] = useState(() => {
    const nivelSalvo = localStorage.getItem("nivel");
    return nivelSalvo ? JSON.parse(nivelSalvo) : 1;
  });

  const [xp, setXp] = useState(() => {
    const xpSalvo = localStorage.getItem("xp");
    return xpSalvo ? JSON.parse(xpSalvo) : 0;
  });

  const [execucoes, setExecucoes] = useState(() => {
    const execucoesSalvas = localStorage.getItem("chaveExecucao");
    return execucoesSalvas ? JSON.parse(execucoesSalvas) : [];
  });

  const [falhasDiarias, setFalhasDiarias] = useState(() => {
    const falhasSalvas = localStorage.getItem("falhasDiarias");
    return falhasSalvas ? JSON.parse(falhasSalvas) : [];
  });

  const [ultimaVerificacao, setUltimaVerificacao] = useState(() => {
    return localStorage.getItem("ultimaVerificacao") || null;
  });

  const [tarefasOcultas, setTarefasOcultas] = useState(() => {
    const ocultasSalvas = localStorage.getItem("tarefasOcultas");
    return ocultasSalvas ? JSON.parse(ocultasSalvas) : [];
  });

  // ===============================
  // 📌 PERSISTÊNCIA NO LOCALSTORAGE
  // ===============================
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefa));
  }, [tarefa]);

  useEffect(() => {
    localStorage.setItem("nivel", JSON.stringify(nivel));
  }, [nivel]);

  useEffect(() => {
    localStorage.setItem("xp", JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("chaveExecucao", JSON.stringify(execucoes));
  }, [execucoes]);

  useEffect(() => {
    localStorage.setItem("falhasDiarias", JSON.stringify(falhasDiarias));
  }, [falhasDiarias]);

  useEffect(() => {
    if (ultimaVerificacao) {
      localStorage.setItem("ultimaVerificacao", ultimaVerificacao);
    }
  }, [ultimaVerificacao]);

  useEffect(() => {
    localStorage.setItem("tarefasOcultas", JSON.stringify(tarefasOcultas));
  }, [tarefasOcultas]);

  // ===============================
  // 📌 VERIFICAÇÃO DE FALHAS DIÁRIAS
  // ===============================
  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];

    if (ultimaVerificacao === hoje) return;

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().split("T")[0];

    const falhas = tarefa
      .filter((t) => t.type === "diaria")
      .filter(
        (t) => !execucoes.some((e) => e.tarefaId === t.id && e.date === dataOntem)
      )
      .map((t) => ({
        tarefaId: t.id,
        date: dataOntem,
      }));

    if (falhas.length > 0) {
      setFalhasDiarias((prev) => {
        const novasFalhas = falhas.filter(
          (f) => !prev.some((p) => p.tarefaId === f.tarefaId && p.date === f.date)
        );
        return [...prev, ...novasFalhas];
      });
    }

    setUltimaVerificacao(hoje);
  }, [tarefa, execucoes, ultimaVerificacao]);

  // ===============================
  // 📌 FUNÇÕES DE NEGÓCIO
  // ===============================
  const xpParaSubir = (nivel) => nivel * 200;
  const xpNecessario = xpParaSubir(nivel);
  const progresso = xpNecessario ? (xp / xpNecessario) * 100 : 0;

  const rank = nivel < 10 ? "E" : nivel < 20 ? "D" : nivel < 30 ? "C" : "B";

  const ganharXp = (ganhoXp) => {
    const novoXp = xp + ganhoXp;
    const xpNecessarioNivel = xpParaSubir(nivel);

    if (novoXp >= xpNecessarioNivel) {
      setNivel(nivel + 1);
      const xpRestante = novoXp - xpNecessarioNivel;
      setXp(xpRestante);
    } else {
      setXp(novoXp);
    }
  };

  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;

    if (tipoTarefa === "semanal") {
      setTarefaPendente({ title: novaTarefa, type: tipoTarefa });
      setMostrarModalSemanal(true);
      return;
    }

    const xpRecompensa = tipoTarefa === "objetivo" ? 500 : 50;

    setTarefa([
      ...tarefa,
      {
        id: Date.now(),
        title: novaTarefa,
        xp: xpRecompensa,
        type: tipoTarefa,
        createdAt: new Date().toISOString(),
      },
    ]);

    setNovaTarefa("");
  };

  const finalizarAdicaoSemanal = (duracao) => {
    const xpRecompensa = xpPorTIpo.semanal;

    setTarefa([
      ...tarefa,
      {
        id: Date.now(),
        title: tarefaPendente.title,
        xp: xpRecompensa,
        type: "semanal",
        duracaoDias: duracao,
        createdAt: new Date().toISOString(),
      },
    ]);

    setNovaTarefa("");
    setTarefaPendente(null);
    setMostrarModalSemanal(false);
  };

  const completarTarefa = (id) => {
    const tarefaEncontrada = tarefa.find((t) => t.id === id);
    if (!tarefaEncontrada) return;

    const hoje = new Date().toISOString().split("T")[0];
    const jaExecutouHoje = execucoes.some(
      (e) => e.tarefaId === id && e.date === hoje
    );

    if (jaExecutouHoje) {
      setExecucoes(
        execucoes.filter((e) => !(e.tarefaId === id && e.date === hoje))
      );
      setXp((prev) => Math.max(0, prev - tarefaEncontrada.xp));
      return;
    }

    ganharXp(tarefaEncontrada.xp);

    setExecucoes([
      ...execucoes,
      {
        tarefaId: id,
        date: hoje,
        xp: tarefaEncontrada.xp,
      },
    ]);
  };

  const deletarTarefa = (id) => {
    setTarefa(tarefa.filter((t) => t.id !== id));
  };

  const verificarSeExpirou = (createdAt, duracaoPersonalizada) => {
    if (!createdAt) return false;

    const dataCriacao = new Date(createdAt);
    const agora = new Date();
    const DIAS_LIMITE = duracaoPersonalizada || 7;
    const MS_POR_DIA = 1000 * 60 * 60 * 24;

    const diasPassados = Math.floor((agora - dataCriacao) / MS_POR_DIA);

    return diasPassados >= DIAS_LIMITE;
  };

  const limparTarefa = (id) => {
    setTarefasOcultas((tarefasAnteriores) =>
      tarefasAnteriores.includes(id)
        ? tarefasAnteriores
        : [...tarefasAnteriores, id]
    );
  };

  const restaurarTarefa = (id) => {
    setTarefasOcultas((prev) => prev.filter((tarefaId) => tarefaId !== id));
  };

  const solicitarAcaoModal = (id, tipoDoModal) => {
    setTarefaSelecionadaId(id);
    setTipoModal(tipoDoModal);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setTarefaSelecionadaId(null);
    setMostrarModal(false);
    setTipoModal(null);
  };

  const confirmarAcaoModal = () => {
    if (tarefaSelecionadaId == null) return;

    if (tipoModal === "remover") {
      deletarTarefa(tarefaSelecionadaId);
    } else if (tipoModal === "limpar") {
      limparTarefa(tarefaSelecionadaId);
    } else if (tipoModal === "restaurar") {
      restaurarTarefa(tarefaSelecionadaId);
    }
    fecharModal();
  };

  // ===============================
  // 📌 FILTROS E MÉTRICAS
  // ===============================
  const tarefaFiltrada =
    filtro === "arquivadas"
      ? tarefa.filter((t) => tarefasOcultas.includes(t.id))
      : filtro === "todos"
      ? tarefa.filter((t) => !tarefasOcultas.includes(t.id))
      : tarefa.filter(
          (t) => t.type === filtro && !tarefasOcultas.includes(t.id)
        );

  const xpTotal = execucoes.reduce((total, t) => total + t.xp, 0);

  const hoje = new Date().toISOString().split("T")[0];

  const tarefasfeitasHoje = execucoes.filter((e) => e.date === hoje).length;

  const pendentesDiarias = tarefa.filter(
    (t) =>
      t.type === "diaria" &&
      !execucoes.some((e) => e.tarefaId === t.id && e.date === hoje)
  ).length;

  const pendentesSemanais = tarefa.filter(
    (t) =>
      t.type === "semanal" &&
      !verificarSeExpirou(t.createdAt, t.duracaoDias) &&
      !execucoes.some((e) => e.tarefaId === t.id)
  ).length;

  const pendentesObjetivos = tarefa.filter(
    (t) => t.type === "objetivo" && !execucoes.some((e) => e.tarefaId === t.id)
  ).length;

  const stats = {
    feitasHoje: tarefasfeitasHoje,
    xpTotal,
    pendentesDiarias,
    pendentesSemanais,
    pendentesObjetivos,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <HeaderStats
          rank={rank}
          nivel={nivel}
          xp={xp}
          xpNecessario={xpNecessario}
          progresso={progresso}
          stats={stats}
        />

        <FormularioTarefa
          novaTarefa={novaTarefa}
          setNovaTarefa={setNovaTarefa}
          tipoTarefa={tipoTarefa}
          setTipoTarefa={setTipoTarefa}
          adicionarTarefa={adicionarTarefa}
          xpPorTipo={xpPorTIpo}
        />

        <Filtros filtro={filtro} setFiltro={setFiltro} />

        {/* Novo botão de Lixeira exatamente como no Home2 */}
        <div>
          <button
            className="bg-zinc-800 hover:bg-zinc-700 transition flex rounded gap-1 text-white items-center px-3 py-1"
            onClick={() => setFiltro("arquivadas")}
          >
            <Archive size={14} /> Lixeira
          </button>
        </div>

        <ListaTarefas
          tarefas={tarefaFiltrada}
          execucoes={execucoes}
          falhasDiarias={falhasDiarias}
          tarefasOcultas={tarefasOcultas}
          verificarSeExpirou={verificarSeExpirou}
          completarTarefa={completarTarefa}
          solicitarAcaoModal={solicitarAcaoModal}
        />

        <ModalConfirmacao
          aberto={mostrarModal}
          tipo={tipoModal}
          onCancelar={fecharModal}
          onConfirmar={confirmarAcaoModal}
        />

        <ModalSemanal
          aberto={mostrarModalSemanal}
          tarefaTitulo={tarefaPendente?.title}
          onCancelar={() => setMostrarModalSemanal(false)}
          onConfirmar={finalizarAdicaoSemanal}
        />
      </div>
    </div>
  );
}