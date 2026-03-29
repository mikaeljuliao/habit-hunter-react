<!--
dia: 25/03/2026

📘 FILTRO DE TAREFAS — EXPLICAÇÃO COMPLETA (DO ZERO AO AVANÇADO)

========================================
🎯 OBJETIVO DO FILTRO
========================================

Criar um sistema que:

- mostra TODAS as tarefas
- ou filtra por tipo:
  - diaria
  - semanal
  - objetivo

E tudo isso muda automaticamente ao clicar nos botões.

---

========================================
🧱 1. DE ONDE VEM O "type"?
========================================

const tarefasIniciais = [{
  id: 1,
  title: 'treinar',
  xp: 50,
  completed: false,
  type: 'diaria'
}]

👉 cada tarefa é um OBJETO

🧠 estrutura:

{
  id,
  title,
  xp,
  completed,
  type
}

---

🧠 MUITO IMPORTANTE:

Quando faço:

tarefa.map((t) => ...)

👉 o "t" é UMA tarefa

Então:

t.id → id  
t.title → título  
t.type → tipo  

---

📌 CONCLUSÃO:

t.type significa:
"pegando o tipo daquela tarefa específica"

---

========================================
🧱 2. ESTADO DO FILTRO
========================================

const [filtro, setFiltro] = useState('todos')

---

🧠 O QUE ISSO SIGNIFICA:

filtro guarda qual filtro está ativo

---

📌 possíveis valores:

'todos'
'diaria'
'semanal'
'objetivo'

---

========================================
🧱 3. BOTÕES CONTROLANDO O FILTRO
========================================

onClick={() => setFiltro('todos')}
onClick={() => setFiltro('diaria')}
onClick={() => setFiltro('semanal')}
onClick={() => setFiltro('objetivo')}

---

🧠 O QUE ACONTECE:

- clica botão
- muda o estado
- React renderiza de novo

---

========================================
🧱 4. O CORAÇÃO DO FILTRO
========================================

const tarefaFiltrada =
  filtro === 'todos'
    ? tarefa
    : tarefa.filter((t) => t.type === filtro)

---

========================================
🧠 5. TERNÁRIO EXPLICADO
========================================

condição ? valor1 : valor2

---

🧠 NO NOSSO CASO:

SE filtro === 'todos'
→ retorna TODAS tarefas

SENÃO
→ retorna filtradas

---

========================================
🧠 6. FILTER EXPLICADO DE VERDADE (AGORA COMPLETO)
========================================

tarefa.filter((t) => t.type === filtro)

---

🔥 ESSA É A PARTE MAIS IMPORTANTE DE TODO O FILTRO

---

🧠 PRIMEIRO: O QUE É "tarefa"?

tarefa = array (lista de objetos)

Exemplo:

[
  { id: 1, type: 'diaria' },
  { id: 2, type: 'semanal' },
  { id: 3, type: 'objetivo' }
]

---

🧠 AGORA: O QUE O FILTER FAZ?

filter percorre TODA a lista item por item

---

👉 ele faz tipo um loop interno (igual um for escondido)

---

🧠 IMAGINA ISSO ACONTECENDO POR DENTRO:

para cada item da lista:

1º volta:
t = { id: 1, type: 'diaria' }

2º volta:
t = { id: 2, type: 'semanal' }

3º volta:
t = { id: 3, type: 'objetivo' }

---

📌 MUITO IMPORTANTE:

t = UMA tarefa por vez  
NÃO é a lista inteira

---

========================================
🧠 AGORA A CONDIÇÃO
========================================

(t) => t.type === filtro

---

👉 isso é uma função que retorna TRUE ou FALSE

---

🧠 TRADUÇÃO HUMANA:

"essa tarefa é do tipo que eu quero?"

---

========================================
🧠 TESTE REAL PASSO A PASSO
========================================

filtro = 'diaria'

---

👉 1º item:

t = { type: 'diaria' }

t.type === filtro
'diaria' === 'diaria' → TRUE ✅

👉 entra na nova lista

---

👉 2º item:

t = { type: 'semanal' }

'semanal' === 'diaria' → FALSE ❌

👉 NÃO entra

---

👉 3º item:

t = { type: 'objetivo' }

'objetivo' === 'diaria' → FALSE ❌

👉 NÃO entra

---

========================================
🧠 RESULTADO FINAL
========================================

nova lista criada pelo filter:

[
  { type: 'diaria' }
]

---

📌 EXTREMAMENTE IMPORTANTE:

filter NÃO remove nada da lista original

---

👉 ele cria uma NOVA lista

---

========================================
🧠 COMO O FILTER DECIDE (REGRA FINAL)
========================================

se a condição retorna TRUE → entra  
se retorna FALSE → fica de fora  

---

📌 então:

t.type === filtro

---

👉 isso vira:

TRUE → entra  
FALSE → não entra  

---

========================================
🧠 O QUE É t.type EXATAMENTE?
========================================

t = objeto

t.type = propriedade desse objeto

---

🧠 EXEMPLO:

t = {
  id: 1,
  title: 'treinar',
  type: 'diaria'
}

---

👉 t.type = 'diaria'

---

📌 ou seja:

estou pegando só o TYPE da tarefa

---

========================================
🧠 POR QUE FUNCIONA?
========================================

porque:

- tarefa é uma lista de objetos
- cada objeto tem "type"
- filtro guarda o tipo atual
- comparo os dois

---

👉 isso cria a lógica:

"mostra só o tipo selecionado"

---

========================================
🧠 7. ERRO QUE COMETI (IMPORTANTE)
========================================

tarefa.filter((t) => t.type == t)

---

❌ errado

---

🧠 por quê?

t.type → string  
t → objeto  

---

👉 comparou coisa diferente

---

✅ correto:

t.type === filtro

---

========================================
🧱 8. POR QUE NÃO USAR FUNÇÃO?
========================================

❌ errado:

const tarefaFiltrada = () => ...

---

porque isso vira FUNÇÃO

---

👉 função NÃO tem map

---

✅ certo:

const tarefaFiltrada = ...

---

👉 vira array direto

---

========================================
🧱 9. EXIBIÇÃO COM MAP
========================================

tarefaFiltrada.map((item) => ...)

---

🧠 o que acontece:

- pega lista filtrada
- percorre
- renderiza

---

========================================
🧠 10. FLUXO COMPLETO
========================================

1. clica botão  
2. setFiltro()  
3. estado muda  
4. React renderiza  
5. filter roda  
6. cria nova lista  
7. map exibe  

---

========================================
🧠 RESUMO FINAL
========================================

- cada tarefa tem um type
- filtro guarda o tipo ativo
- botão muda filtro
- ternário decide o que mostrar
- filter cria nova lista
- map renderiza

---

========================================
🔥 FRASE PRA GRAVAR
========================================

filter cria uma nova lista com base numa condição

---

========================================
💥 CORREÇÃO FINAL
========================================

const tarefaFiltrada =
  filtro === 'todos'
    ? tarefa
    : tarefa.filter((t) => t.type === filtro)

---

⚠️ corrigir também:

setFiltro('diaria')  // não "diario"
setFiltro('objetivo') // não vazio






















































dia: 26/03/2026


📘 STATS — ESTRUTURA E ESTILIZAÇÃO
1 PARTE:

==============================
🧱 ESTRUTURA COMPLETA
==============================

<div className='grid grid-cols-3 gap-4 mt-4 text-center'>
  
  <div>
    <p>{tarefa.filter((t) => t.completed).length}</p>
    <p>Completas</p>
  </div>

  <div>
    <p>{tarefa.filter((t) => !t.completed).length}</p>
    <p>Pendentes</p>
  </div>

  <div>
    <p>{xpTotal}</p>
    <p>XP Total</p>
  </div>

</div>

---

==============================
🎯 OBJETIVO
==============================

Criar uma seção visual que mostra:

- quantidade de tarefas completas
- quantidade de tarefas pendentes
- XP total acumulado

👉 tudo de forma clara, organizada e equilibrada na tela

---

==============================
🧱 CONTAINER PRINCIPAL (GRID)
==============================

<div className='grid grid-cols-3 gap-4 mt-4 text-center'>

👉 aqui defini toda a estrutura da seção

---

🔹 grid

👉 ativa o layout em grade (diferente do flex)

👉 ao invés de trabalhar em linha (flex),
aqui eu trabalho em COLUNAS

---

🔹 grid-cols-3

👉 define 3 colunas iguais

📌 resultado:

[   COLUNA 1   |   COLUNA 2   |   COLUNA 3   ]

---

🔹 gap-4

👉 espaço entre as colunas

- não gruda um bloco no outro
- melhora a leitura visual

---

🔹 mt-4

👉 margem no topo

- separa dos elementos acima (barra de XP)

---

🔹 text-center

👉 centraliza tudo dentro das colunas

📌 isso é importante porque:

- números ficam alinhados
- labels ficam alinhados
- visual fica mais limpo

---

==============================
🧱 CADA BLOCO DE STAT
==============================

<div>
  <p>VALOR</p>
  <p>LABEL</p>
</div>

👉 cada stat é um bloco simples

---

📌 padrão visual:

[ número grande ]
[ texto explicativo ]

---

==============================
🧱 STAT 1 — COMPLETAS
==============================

<div>
  <p>{tarefa.filter((t) => t.completed).length}</p>
  <p>Completas</p>
</div>

---

🔹 estrutura:

<p> → valor dinâmico  
<p> → label  

---

🔹 visual:

- número em cima
- texto embaixo

---

📌 padrão de leitura:

olho bate no número → depois entende o que é

---

==============================
🧱 STAT 2 — PENDENTES
==============================

<div>
  <p>{tarefa.filter((t) => !t.completed).length}</p>
  <p>Pendentes</p>
</div>

---

👉 mesma estrutura do anterior

👉 isso mantém consistência visual

---

📌 IMPORTANTE:

manter mesmo padrão = interface mais profissional

---

==============================
🧱 STAT 3 — XP TOTAL
==============================

<div>
  <p>{xpTotal}</p>
  <p>XP Total</p>
</div>

---

👉 aqui uso um valor já calculado fora

👉 isso deixa o JSX mais limpo

---

==============================
🧠 POR QUE USAR GRID AQUI?
==============================

poderia usar flex?

👉 sim

mas grid é melhor porque:

- define colunas fixas (3)
- mantém alinhamento perfeito
- escala melhor

---

📌 COM FLEX:

precisaria controlar largura manual

---

📌 COM GRID:

já nasce organizado

---

==============================
🧠 HIERARQUIA VISUAL
==============================

cada bloco segue o mesmo padrão:

1. valor (mais importante)
2. label (explicação)

---

👉 isso cria uma leitura natural:

👀 olho vê número → entende contexto depois

---

==============================
🧠 ORGANIZAÇÃO FINAL NA TELA
==============================

[ COMPLETAS | PENDENTES | XP TOTAL ]

[    3      |     2     |    250   ]

---

==============================
🔥 BOAS PRÁTICAS USADAS
==============================

✔ grid pra layout consistente  
✔ padrão repetido (design system simples)  
✔ separação clara entre valor e label  
✔ espaçamento (gap + margin)  
✔ centralização (text-center)  

---

==============================
🧠 RESUMO ULTRA SIMPLES
==============================

grid → cria 3 colunas  
cada div → um stat  
p → valor  
p → label  

👉 simples, organizado e escalável
























📘 STATS — LÓGICA COMPLETA (FILTER + REDUCE + RACIOCÍNIO TOTAL)
2 PARTE:
==============================
🎯 OBJETIVO
==============================

Aqui eu quis calcular 3 coisas:

- tarefas completas
- tarefas pendentes
- XP total acumulado

👉 tudo isso vem do array principal:

const tarefa = [...]

---

==============================
🧱 ESTRUTURA DOS DADOS (BASE DE TUDO)
==============================

const tarefasIniciais = [
  {
    id: 1,
    title: 'treinar',
    xp: 50,
    completed: false,
    type: 'diaria'
  }
]

👉 cada tarefa é um OBJETO

📌 isso é MUITO importante entender:

tarefa = ARRAY
cada item = OBJETO

---

🧠 VISUALIZANDO:

[
  { xp: 50, completed: true },
  { xp: 100, completed: false },
  { xp: 200, completed: true }
]

---

👉 então:

- tarefa → lista inteira
- t → cada item individual

---

==============================
🧱 1. TAREFAS COMPLETAS
==============================

tarefa.filter((t) => t.completed).length

---

🧠 PASSO A PASSO

🔹 filter percorre o array inteiro

👉 é como um loop automático

---

🔹 t representa cada tarefa

t = { xp: 50, completed: true }

---

🔹 condição:

t.completed

👉 isso significa:

"essa tarefa está completa?"

---

🔹 como o JS lê isso:

if (t.completed === true)

---

🔹 resultado do filter:

[
  { completed: true },
  { completed: true }
]

---

🔹 .length

👉 conta quantos itens sobraram

---

📌 RESULTADO FINAL:

quantidade de tarefas completas

---

==============================
🧱 2. TAREFAS PENDENTES
==============================

tarefa.filter((t) => !t.completed).length

---

🧠 AQUI TEM UM DETALHE MUITO IMPORTANTE

🔹 ! = negação

---

👉 !t.completed significa:

"não está completo"

---

🧠 TRADUÇÃO:

se completed = true → vira false  
se completed = false → vira true  

---

📌 exemplo:

t.completed = false  
!t.completed = true ✔

---

👉 então o filter pega só as pendentes

---

📌 resultado:

[
  { completed: false },
  { completed: false }
]

---

👉 .length conta quantas

---

==============================
🧱 3. XP TOTAL (PARTE MAIS IMPORTANTE)
==============================

const xpTotal = tarefa
  .filter(item => item.completed)
  .reduce((total, t) => total + t.xp, 0)

---

==============================
🧠 PASSO 1 — FILTER
==============================

.filter(item => item.completed)

---

👉 aqui eu fiz a PRIMEIRA ETAPA:

"pegar só tarefas completas"

---

📌 resultado:

[
  { xp: 50 },
  { xp: 200 }
]

---

⚠️ IMPORTANTE:

isso evita um erro:

👉 somar XP de tarefa não concluída

---

==============================
🧠 PASSO 2 — REDUCE
==============================

.reduce((total, t) => total + t.xp, 0)

---

👉 aqui começa a parte mais importante

---

==============================
🧠 O QUE É O REDUCE (DE VERDADE)
==============================

👉 reduce transforma um ARRAY em UM ÚNICO VALOR

---

📌 nesse caso:

[50, 200] → 250

---

==============================
🧠 SINTAXE EXPLICADA
==============================

(total, t) => total + t.xp

---

🔹 total → acumulador  
🔹 t → item atual  

---

🔹 0 → valor inicial

---

==============================
🧠 EXECUÇÃO REAL (PASSO A PASSO)
==============================

array depois do filter:

[
  { xp: 50 },
  { xp: 200 }
]

---

🔹 início:

total = 0

---

🔹 primeira volta:

total + t.xp  
0 + 50 = 50  

👉 novo total = 50

---

🔹 segunda volta:

50 + 200 = 250  

👉 novo total = 250

---

🔹 fim do array

---

📌 resultado final:

xpTotal = 250

---

==============================
🧠 O QUE O REDUCE FAZ POR BAIXO DOS PANOS
==============================

isso aqui é o mais importante de entender:

---

reduce é equivalente a:

let total = 0

for (let i = 0; i < tarefas.length; i++) {
  total = total + tarefas[i].xp
}

---

👉 ou seja:

é um loop automático que acumula valores

---

==============================
🧠 POR QUE NÃO USAR MAP?
==============================

map → transforma itens  
filter → filtra itens  
reduce → acumula valores  

---

👉 só reduce serve pra soma

---

==============================
🧠 FLUXO COMPLETO (DO INÍCIO AO FIM)
==============================

1. tenho várias tarefas (array)
2. filtro só as completas
3. pego o xp de cada uma
4. somo tudo com reduce
5. retorno um número final

---

==============================
🧠 COMO O REACT ATUALIZA ISSO
==============================

👉 toda vez que o estado muda:

setTarefa(...)

---

👉 o React re-renderiza o componente

---

👉 isso recalcula automaticamente:

- completas
- pendentes
- xpTotal

---

📌 ou seja:

você NÃO precisa atualizar manualmente

---

==============================
🧠 ERROS QUE EU EVITEI
==============================

❌ tarefa.xp (array não tem xp direto)  
❌ somar sem filtrar  
❌ esquecer valor inicial do reduce  
❌ usar map pra somar  

---

==============================
🔥 CONCEITOS APRENDIDOS
==============================

- array de objetos
- filter (filtragem)
- ! (negação)
- reduce (acumulador)
- fluxo de dados
- re-render do React

---

==============================
🧠 RESUMO ULTRA SIMPLES
==============================

filter → escolhe quem entra  
reduce → soma tudo  
length → conta  

👉 juntos formam os stats



-->