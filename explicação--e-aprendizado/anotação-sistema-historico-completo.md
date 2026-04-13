<!--

📘 SISTEMA DE HISTÓRICO — COMO CONSTRUÍMOS DO ZERO AO NÍVEL SAAS

Data: 13/04/2026

Aqui eu vou explicar TUDO que fiz pra criar o sistema de histórico do Habit Hunter.
A ideia é que eu (ou qualquer pessoa) consiga recriar isso do zero entendendo cada decisão.

==============================
🎯 OBJETIVO
==============================

Criar um sistema que registre o que aconteceu com cada missão, em cada dia,
e exiba isso de forma visual, organizada e sem inconsistências.

---

==============================
🧠 1. O PROBLEMA QUE PRECISÁVAMOS RESOLVER
==============================

Sem um histórico, a aplicação sabia três coisas:
- Quais missões existem agora
- Se foram feitas hoje
- Se alguém falhou ontem

Mas não sabia NADA sobre o passado:
- O que o usuário fez há 3 dias?
- Quais missões foram removidas?
- Quanta XP foi ganha na semana passada?

Para isso, precisamos de um REGISTRO de eventos. Como um diário da aplicação.

---

==============================
🧱 2. A IDEIA CENTRAL: LOG DE EVENTOS
==============================

A solução que usamos se chama "Event Log" (Registro de Eventos).

👉 A ideia é simples:
Toda vez que algo acontece com uma missão, a gente ANOTA esse acontecimento num array.

Pense num caderno de anotações:
- "Dia 10/04 - Concluí a missão 'Treinar'"
- "Dia 11/04 - Falhei em 'Ler livro'"
- "Dia 11/04 - Removi a missão 'Ir ao mercado'"

Esse array de anotações é o nosso `logEventos`.

---

==============================
🏗️ 3. A ESTRUTURA DE CADA EVENTO (LOG)
==============================

Cada entrada no nosso logEventos é um objeto com 6 campos:

```js
{
  id: 1776200001,        // Um número único pra identificar o evento
  action: "CONCLUSAO",  // O QUE aconteceu (veja tabela abaixo)
  date: "2026-04-11",   // QUANDO aconteceu (formato YYYY-MM-DD)
  title: "Treinar",     // QUAL missão foi afetada
  type: "diaria",       // Tipo da missão (diaria, semanal, objetivo)
  xp: 50               // XP ganho ou perdido nesse evento
}
```

📋 TABELA DOS TIPOS DE ACTION:

| action       | O que significa                              |
|--------------|----------------------------------------------|
| CONCLUSAO    | Usuário marcou a missão como feita           |
| FALHA        | O sistema detectou que a diária não foi feita|
| REMOCAO      | Usuário deletou a missão permanentemente     |
| ARQUIVAMENTO | Missão foi enviada para a Lixeira            |
| DESMARCADA   | Usuário desmarcou uma conclusão              |
| RESTAURADA   | Missão foi resgatada da Lixeira              |
| CRIACAO      | (interno, não exibido) — missão foi criada   |

---

==============================
💾 4. ONDE GUARDAMOS: useState + localStorage
==============================

O logEventos é um estado React igual a qualquer outro do nosso projeto:

```js
const [logEventos, setLogEventos] = useState(() => {
  const salvas = localStorage.getItem('logEventos')
  if (salvas) return JSON.parse(salvas);
  return []; // começa vazio (ou com mock inicial)
});
```

👉 Por que a função dentro do useState?
Porque `localStorage.getItem` é uma operação "cara" (lenta).
Passar uma função garante que ela só roda UMA VEZ quando o componente nasce,
e não a cada re-renderização. Isso se chama "Lazy Initialization".

E pra salvar automaticamente quando muda:

```js
useEffect(() => {
  localStorage.setItem('logEventos', JSON.stringify(logEventos));
}, [logEventos]);
```

👉 Toda vez que `logEventos` mudar, esse Effect salva no navegador.
O array `[logEventos]` no final é a "dependência" — ele diz: "rode isso sempre que logEventos mudar".

---

==============================
✏️ 5. COMO REGISTRAR EVENTOS: A FUNÇÃO registrarEvento
==============================

Criamos uma função central que adiciona um novo evento no log:

```js
const registrarEvento = (action, title, type, xpGained = 0) => {
  const hojeLocal = new Date().toISOString().split("T")[0];
  setLogEventos(prev => [
    { id: Date.now() + Math.random(), action, date: hojeLocal, title, type, xp: xpGained },
    ...prev
  ]);
};
```

📌 Detalhes importantes:

1. `new Date().toISOString().split("T")[0]`
   → Pega a data de hoje no formato "2026-04-13"
   → O `.split("T")` corta na letra T e pega só a parte da data (não a hora)

2. `Date.now() + Math.random()`
   → Cria um ID único pra cada evento
   → `Date.now()` retorna os milissegundos desde 1970 (ex: 1713043200000)
   → `Math.random()` adiciona um decimal aleatório, evitando colisão se dois eventos forem registrados no mesmo milissegundo

3. `[{ novo evento }, ...prev]`
   → O novo evento vai no INÍCIO do array (mais recente primeiro)
   → `...prev` copia todos os eventos anteriores depois

---

==============================
🔌 6. ONDE CHAMAMOS: DENTRO DAS FUNÇÕES DE NEGÓCIO
==============================

Toda função que muda o estado de uma missão chama o registrarEvento:

```js
// Ao adicionar missão:
const adicionarTarefa = () => {
  // ... cria a tarefa ...
  registrarEvento("CRIACAO", novaTarefa, tipoTarefa, 0);
}

// Ao concluir:
const completarTarefa = (id) => {
  // ... marca executada ...
  registrarEvento("CONCLUSAO", tarefaEncontrada.title, tarefaEncontrada.type, tarefaEncontrada.xp);
}

// Ao deletar:
const deletarTarefa = (id) => {
  const t = tarefa.find(x => x.id === id);
  if (t) registrarEvento("REMOCAO", t.title, t.type, 0);
  // ... remove do array ...
}
```

---

==============================
⚠️ 7. O PROBLEMA DA INCONSISTÊNCIA (e como resolvemos)
==============================

Aqui está o problema mais importante e inteligente que resolvemos.

🐛 PROBLEMA:
Imagine que você concluiu uma missão → vai pro log como CONCLUSAO.
Depois desmarcou → vai pro log como DESMARCADA.

Mas agora o histórico mostra OS DOIS! A missão aparece como concluída E como desfeita.
Isso é uma INCONSISTÊNCIA: o log não reflete a realidade.

❌ Antes (ruim):
```js
if (jaExecutouHoje) {
  // remove da execucoes...
  registrarEvento("DESMARCADA", ...); // apenas adiciona no log
  return
}
```

✅ Depois (correto):
```js
if (jaExecutouHoje) {
  // remove da execucoes...
  setLogEventos(prev => {
    // PRIMEIRO: remove o CONCLUSAO desse mesmo dia para essa mesma missão
    const semConclusao = prev.filter(
      l => !(l.action === 'CONCLUSAO' && l.title === tarefaEncontrada.title && l.date === hoje)
    );
    // DEPOIS: adiciona o DESMARCADA
    return [
      { id: Date.now() + Math.random(), action: 'DESMARCADA', date: hoje, ... },
      ...semConclusao
    ];
  });
  return
}
```

👉 O que mudou?
Em vez de simplesmente adicionar um evento, agora fazemos dois passos numa única operação:
1. Filtramos o array removendo o evento que contradiz o que estamos fazendo
2. Adicionamos o novo evento que representa o estado atual real

A mesma lógica foi aplicada no RESTAURAR (remove o ARQUIVAMENTO) e no sistema de falhas.

🧠 REGRA DE OURO:
> Ações inversas (desfazer) devem CANCELAR o evento original no log,
> não apenas empilhar um novo evento em cima.

---

==============================
📊 8. A DIFERENÇA ENTRE LOG (EVENTOS) E ESTADO REAL
==============================

Esse foi outro conceito chave que precisamos entender muito bem.

Temos dois tipos de dados no projeto:

📌 TIPO 1 — ESTADO REAL (arrays de verdade):
- `execucoes` → as conclusões que AINDA ESTÃO ativas
- `falhasDiarias` → as falhas que o sistema detectou

📌 TIPO 2 — LOG DE EVENTOS (histórico de ações):
- `logEventos` → tudo que aconteceu, já corrigido pelas ações inversas

🧑‍🏫 POR QUE ISSO IMPORTA?

Para as ESTATÍSTICAS DO DIA no histórico, precisamos usar o estado real, não os eventos:

❌ Errado (conta eventos, ignora desmarques):
```js
const concluidasDia = logsCompletoDia.filter(l => l.action === "CONCLUSAO").length;
```

✅ Correto (conta o estado atual real):
```js
const execucoesDia = execucoes.filter(e => e.date === data);
const concluidasDia = execucoesDia.length;
const xpDia = execucoesDia.reduce((s, e) => s + e.xp, 0);
```

👉 Por que?
Porque `execucoes` é sempre o estado atual — se o usuário desmarcou, a execução foi removida do array.
O log pode ter o CONCLUSAO mas a `execucoes` já está atualizada e correta.

---

==============================
🎨 9. A INTERFACE: COMO MOSTRAMOS TUDO ISSO (renderHistorico)
==============================

Toda a lógica de exibição fica numa função chamada `renderHistorico`.
Ela é chamada apenas quando o usuário clica em "Histórico", ou seja, não roda sem necessidade.

```js
{filtro === "historico" ? (
  renderHistorico()
) : (
  // lista normal de tarefas...
)}
```

A função tem 4 partes principais:

---

🔹 PARTE 1 — AGRUPAR POR DATA:

```js
const agrupado = logEventos.reduce((acc, log) => {
  if (!acc[log.date]) acc[log.date] = [];
  acc[log.date].push(log);
  return acc;
}, {});
```

O `.reduce()` transforma o array em um objeto onde cada chave é uma data:

```js
// Antes: array flat
[
  { date: "2026-04-13", action: "CONCLUSAO", title: "Treinar" },
  { date: "2026-04-11", action: "FALHA", title: "Meditar" },
  { date: "2026-04-13", action: "REMOCAO", title: "Compras" },
]

// Depois: agrupado por data
{
  "2026-04-13": [
    { action: "CONCLUSAO", title: "Treinar" },
    { action: "REMOCAO", title: "Compras" }
  ],
  "2026-04-11": [
    { action: "FALHA", title: "Meditar" }
  ]
}
```

👉 Agora conseguimos mostrar "os eventos desse dia" facilmente: `agrupado["2026-04-13"]`

---

🔹 PARTE 2 — DASHBOARD GLOBAL DE RESUMO:

4 cards no topo do histórico com métricas de TUDO (todos os dias combinados):

```js
const totalXpGanho   = logEventos.filter(l => l.action === "CONCLUSAO").reduce((sum, l) => sum + l.xp, 0);
const totalConcluidas = logEventos.filter(l => l.action === "CONCLUSAO").length;
const totalFalhas    = logEventos.filter(l => l.action === "FALHA").length;
const baseCalculo    = totalConcluidas + totalFalhas;
const taxaSucesso    = baseCalculo === 0 ? 0 : Math.round((totalConcluidas / baseCalculo) * 100);
```

📌 Por que taxa de sucesso é concluídas / (concluídas + falhas)?
Porque essa é a pergunta real: "De todas as oportunidades que tive, em quantas eu fui bem?"
Usar o total de criações seria injusto — criamos missões e depois as removemos por vários motivos.

---

🔹 PARTE 3 — O ACCORDION (a lista de dias):

Cada dia vira um card clicável. Fechado mostra um resumo rápido. Aberto mostra tudo.

```js
const datasLog = Object.keys(agrupado).sort((a, b) => new Date(b) - new Date(a));
```

👉 `Object.keys(agrupado)` retorna as datas
👉 `.sort((a, b) => new Date(b) - new Date(a))` ordena do mais recente pro mais antigo

Para cada data, calculamos as estatísticas usando os arrays de estado real:

```js
const execucoesDia  = execucoes.filter(e => e.date === data);
const xpDia         = execucoesDia.reduce((s, e) => s + e.xp, 0);
const concluidasDia = execucoesDia.length;
const falhasDia     = falhasDiarias.filter(f => f.date === data).length;
const removidosDia  = logsCompletoDia.filter(l => l.action === "REMOCAO").length;
const arquivadosDia = logsCompletoDia.filter(l => l.action === "ARQUIVAMENTO").length;
const totalDia      = concluidasDia + falhasDia + removidosDia + arquivadosDia;
```

O clique abre/fecha via:

```js
const [dataExpandida, setDataExpandida] = useState(null);

// no botão:
onClick={() => setDataExpandida(isExpanded ? null : data)}

// controla abertura:
const isExpanded = data === dataExpandida;
{isExpanded && (
  <div> ...conteúdo do dia... </div>
)}
```

---

🔹 PARTE 4 — O FEED DO DIA (os cards de evento):

Cada evento recebe um visual baseado no seu `action`:

```js
const ACAO_CONFIG = {
  CONCLUSAO:    { label: "Concluída",     cor: "text-green-400",  Icon: CheckCircle2 },
  FALHA:        { label: "Falha",         cor: "text-red-400",    Icon: XCircle },
  REMOCAO:      { label: "Removida",      cor: "text-red-400",    Icon: Trash2 },
  ARQUIVAMENTO: { label: "Arquivada",     cor: "text-yellow-500", Icon: Archive },
  DESMARCADA:   { label: "Desfeita",      cor: "text-orange-400", Icon: XCircle },
  RESTAURADA:   { label: "Restaurada",    cor: "text-cyan-400",   Icon: Target },
};
```

👉 É como um dicionário: "para o action X, use esse ícone e essa cor"
Isso evita um monte de if/else feio no JSX.

---

==============================
🔍 10. O SISTEMA DE FILTROS (dois níveis!)
==============================

Criamos filtros em dois níveis:

📌 NÍVEL 1 — Filtro Global (fora do accordion):
Afeta quais DIAS aparecem na lista. Se filtrar por "Falhas", os dias sem falha somem.

```js
const [filtroLogs, setFiltroLogs] = useState('todos');

// Ao montar os logs visíveis de cada dia:
const logsVisiveis = (filtroLogs === 'todos'
  ? logsDoDia
  : logsDoDia.filter(l => l.action === filtroLogs)
).filter(l => l.action !== 'CRIACAO'); // sempre esconde criações
```

📌 NÍVEL 2 — Filtro Interno do Dia (dentro do accordion expandido):
Usa o mesmo estado `filtroLogs` — então filtrar aqui filtra em tudo!
Isso dá ao usuário controle granular: "olha só as falhas do dia 11".

---

==============================
🎭 11. O MOCK INICIAL (dados de exemplo)
==============================

No primeiro acesso, o `logEventos` começa vazio.
Pra o usuário não ver uma tela em branco, criamos dados de exemplo dos 3 dias anteriores:

```js
const [logEventos, setLogEventos] = useState(() => {
  const salvas = localStorage.getItem('logEventos')
  if (salvas) return JSON.parse(salvas); // usa os dados reais se existirem

  // se não tem dados ainda, cria o mock:
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const ontem = d.toISOString().split("T")[0];
  // ... e assim por diante para anteontem e 3 dias atrás

  return [
    { id: 102, action: "CONCLUSAO", date: tresDias, title: "Ler 20 páginas", ... },
    { id: 105, action: "FALHA",     date: ontem,    title: "Ir na Academia", ... },
    // etc...
  ];
});
```

👉 O `if (salvas) return JSON.parse(salvas)` garante que o mock só aparece
   uma vez — assim que o usuário usar de verdade, os dados reais substituem.

---

==============================
🧠 12. RESUMO PARA RECRIAR DO ZERO
==============================

Se eu precisar recriar esse sistema em outro projeto:

✅ PASSO 1 — Criar o estado e persistência:
```js
const [logEventos, setLogEventos] = useState(() => {
  const salvas = localStorage.getItem('logEventos')
  return salvas ? JSON.parse(salvas) : []
});
useEffect(() => {
  localStorage.setItem('logEventos', JSON.stringify(logEventos));
}, [logEventos]);
```

✅ PASSO 2 — Criar a função de registro:
```js
const registrarEvento = (action, title, type, xpGained = 0) => {
  const hoje = new Date().toISOString().split("T")[0];
  setLogEventos(prev => [
    { id: Date.now() + Math.random(), action, date: hoje, title, type, xp: xpGained },
    ...prev
  ]);
};
```

✅ PASSO 3 — Chamar nas funções de negócio:
Toda função que muda estado de missão chama o registrarEvento.

✅ PASSO 4 — Tratar ações inversas com cancelamento:
Ao desmarcar/restaurar, usar setLogEventos(prev => { ... }) pra remover
o evento contrário ANTES de adicionar o novo.

✅ PASSO 5 — Exibir:
- Agrupar por data com `.reduce()`
- Ordenar datas com `.sort()`
- Accordion com `useState` para controlar qual dia está aberto
- Usar os arrays de estado real (execucoes, falhasDiarias) para as estatísticas,
  NÃO contar eventos do log

---

==============================
💎 CONCEITOS APRENDIDOS NESSE SISTEMA
==============================

📌 Event Log Pattern
→ Registrar ações como objetos em um array, não apenas o estado final.

📌 Lazy Initialization do useState
→ Passar uma função para o useState evita processamento desnecessário.

📌 Idempotência / Ações Inversas
→ Quando desfazer algo, cancele o evento original. Não apenas empilhe novos.

📌 Fonte de Verdade Certa para cada dado
→ Estatísticas atuais = arrays de estado (execucoes, falhasDiarias)
→ Histórico de acontecimentos = logEventos

📌 Agrupamento com .reduce()
→ Transformar array flat em objeto agrupado por chave.

📌 Config Map no lugar de if/else
→ Usar um objeto `ACAO_CONFIG = { CONCLUSAO: {...}, FALHA: {...} }` em vez
   de um monte de if's pra decidir ícone/cor de cada tipo de evento.

---

-->
