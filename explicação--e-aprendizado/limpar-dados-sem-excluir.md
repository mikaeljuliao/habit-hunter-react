<!--
🧹 FUNCIONALIDADE: LIMPAR (OCULTAR) TAREFAS SEM EXCLUSÃO PERMANENTE

📌 OBJETIVO
Permitir que uma tarefa seja removida apenas da exibição da interface,
sem ser excluída permanentemente do array de tarefas ou do localStorage.
Isso é conhecido como "soft delete" ou "ocultação".

------------------------------------------------------------
📦 1. ESTADO RESPONSÁVEL PELAS TAREFAS OCULTAS
------------------------------------------------------------

const [tarefasOcultas, setTarefasOcultas] = useState(() => {
  const ocultasSalvas = localStorage.getItem('tarefasOcultas');
  return ocultasSalvas ? JSON.parse(ocultasSalvas) : [];
});

✔ O que é:
- Um estado React que armazena apenas os IDs das tarefas ocultas.
- Exemplo: [1, 5, 9]

✔ Por que usar apenas o ID?
- Evita alterar a estrutura original das tarefas.
- Mantém o código mais simples e organizado.
- Permite restaurar tarefas futuramente.

------------------------------------------------------------
💾 2. SALVAMENTO NO LOCALSTORAGE
------------------------------------------------------------

useEffect(() => {
  localStorage.setItem('tarefasOcultas', JSON.stringify(tarefasOcultas));
}, [tarefasOcultas]);

✔ O que faz:
- Sempre que o estado tarefasOcultas muda, ele é salvo no navegador.
- Garante persistência mesmo após recarregar a página.

------------------------------------------------------------
🧠 3. FUNÇÃO PARA LIMPAR (OCULTAR) UMA TAREFA
------------------------------------------------------------

const limparTarefa = (id) => {
  setTarefasOcultas((prev) =>
    prev.includes(id) ? prev : [...prev, id]
  );
};

✔ Entendendo cada parte:

🔹 (id)
- É o identificador da tarefa que será ocultada.
- Esse valor vem do botão na interface:
  onClick={() => limparTarefa(item.id)}
- Portanto, "id" representa exatamente o ID da tarefa clicada.

🔹 setTarefasOcultas(...)
- Função responsável por atualizar o estado.

🔹 (prev) => ...
- "prev" significa "previous state" (estado anterior).
- Não é um método, apenas um nome de parâmetro.
- Representa o valor atual de tarefasOcultas antes da atualização.
- Poderia ser chamado de qualquer outro nome, como:
  (estadoAnterior) => ...

Exemplo:
Se tarefasOcultas = [1, 2], então prev = [1, 2].

🔹 prev.includes(id)
- "includes" é um método de array que verifica se um valor existe dentro dele.
- Retorna true ou false.

Exemplos:
[1, 2, 3].includes(2) → true
[1, 2, 3].includes(5) → false

- No nosso caso, verifica se o ID já está na lista de tarefas ocultas,
  evitando duplicações.

🔹 Operador Ternário
prev.includes(id) ? prev : [...prev, id]

Equivalente a:

if (prev.includes(id)) {
  return prev;           // Já está oculto, não faz nada
} else {
  return [...prev, id];  // Adiciona o ID ao array
}

🔹 Spread Operator (...prev)
- O operador "..." copia todos os elementos de um array para um novo array.
- Isso é necessário porque o React exige que o estado seja imutável.

Exemplo:
prev = [1, 2]
id = 3

Resultado:
[...prev, id] → [1, 2, 3]

------------------------------------------------------------
👁️ 4. COMO A TAREFA "SOME" DA TELA
------------------------------------------------------------

A tarefa não é removida do array original. Em vez disso,
ajustamos o filtro de renderização para ignorar os IDs ocultos.

ANTES:
const tarefaFiltrada =
  filtro === 'todos'
    ? tarefa
    : tarefa.filter((t) => t.type === filtro);

DEPOIS:
const tarefaFiltrada =
  filtro === 'todos'
    ? tarefa.filter((t) => !tarefasOcultas.includes(t.id))
    : tarefa.filter(
        (t) =>
          t.type === filtro &&
          !tarefasOcultas.includes(t.id)
      );

✔ O que significa:
- tarefasOcultas.includes(t.id) verifica se a tarefa está oculta.
- O operador "!" (negação) garante que apenas tarefas NÃO ocultas sejam exibidas.

✔ Exemplo Prático:
tarefa = [
  { id: 1, title: "Treinar" },
  { id: 2, title: "Estudar" }
];

tarefasOcultas = [1];

Resultado:
tarefaFiltrada = [
  { id: 2, title: "Estudar" }
];

A tarefa com ID 1 continua existindo, mas não é exibida.

------------------------------------------------------------
🔄 5. RESTAURANDO UMA TAREFA (OPCIONAL)
------------------------------------------------------------

const restaurarTarefa = (id) => {
  setTarefasOcultas((prev) =>
    prev.filter((tId) => tId !== id)
  );
};

✔ O que faz:
- Remove o ID da lista de tarefas ocultas.
- A tarefa volta a ser exibida normalmente.

------------------------------------------------------------
📊 6. RESUMO DOS CONCEITOS IMPORTANTES
------------------------------------------------------------

| Conceito            | Explicação |
|---------------------|------------|
| id                  | Identificador da tarefa clicada. |
| prev                | Estado anterior de tarefasOcultas. |
| includes()          | Verifica se um valor existe no array. |
| Spread Operator ... | Copia os elementos do array. |
| Operador Ternário   | Forma simplificada de um if/else. |
| !includes()         | Garante que apenas tarefas não ocultas sejam exibidas. |

------------------------------------------------------------
🚀 7. FLUXO COMPLETO DA FUNCIONALIDADE
------------------------------------------------------------

1. Usuário clica no botão "Limpar".
2. O ID da tarefa é enviado para a função limparTarefa.
3. O ID é adicionado ao estado tarefasOcultas.
4. O estado é salvo no localStorage.
5. O filtro de renderização ignora tarefas ocultas.
6. A tarefa desaparece da interface, mas não é excluída.

------------------------------------------------------------
✅ VANTAGENS DESSA ABORDAGEM
------------------------------------------------------------

✔ Não altera a estrutura original das tarefas.
✔ Não remove dados permanentemente.
✔ Permite restaurar tarefas no futuro.
✔ Código simples e organizado.
✔ Melhora a experiência do usuário.
✔ Fácil de reutilizar em outros projetos.

------------------------------------------------------------
📌 CONCLUSÃO
------------------------------------------------------------

A funcionalidade de "limpar" tarefas é uma solução elegante e
amplamente utilizada para ocultar informações sem perdê-las.
Compreender conceitos como "prev", "includes" e o "spread operator"
é essencial para manipular estados de forma segura e eficiente no React.
-->