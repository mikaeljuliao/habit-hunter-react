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

---
-->