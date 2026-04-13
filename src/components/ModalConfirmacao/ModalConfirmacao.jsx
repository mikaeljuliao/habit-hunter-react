import React from "react";

export default function ModalConfirmacao({
  aberto,
  tipo,
  onCancelar,
  onConfirmar,
}) {
  if (!aberto) return null;

  const titulo =
    tipo === "remover"
      ? "Confirmar remoção"
      : tipo === "limpar"
      ? "Confirmar arquivamento"
      : "Confirmar restauração";

  const mensagem =
    tipo === "remover"
      ? "Tem certeza que deseja remover esta tarefa?"
      : tipo === "limpar"
      ? "Deseja arquivar esta tarefa?"
      : "Deseja restaurar esta tarefa?";

  const descricao =
    tipo === "remover"
      ? "Não será possível restaurá-la."
      : tipo === "limpar"
      ? "Ela poderá ser restaurada na lixeira."
      : "Ela voltará para a lista principal.";

  const corBotao =
    tipo === "remover"
      ? "bg-red-500 hover:bg-red-600"
      : tipo === "limpar"
      ? "bg-yellow-500 hover:bg-yellow-600"
      : "bg-green-500 hover:bg-green-600";

  const textoBotao =
    tipo === "remover"
      ? "Remover"
      : tipo === "limpar"
      ? "Arquivar"
      : "Restaurar";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{titulo}</h2>

        <p className="mb-2">{mensagem}</p>
        <p className="mb-6 text-sm text-zinc-300">{descricao}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-500/70 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 text-white rounded ${corBotao}`}
          >
            {textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}