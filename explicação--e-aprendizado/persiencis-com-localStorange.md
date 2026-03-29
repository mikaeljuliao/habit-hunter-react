<!--
📦 LOCALSTORAGE NO REACT — ANOTAÇÃO COMPLETA E PRÁTICA


📌 INTUITO (O QUE ESTAMOS FAZENDO)

Queremos fazer nosso app "lembrar" das informações mesmo depois de fechar o site.

Sem localStorage:
→ tudo some ao atualizar

Com localStorage:
→ dados continuam salvos no navegador


📌 COMO O LOCALSTORAGE FUNCIONA

Ele funciona como um armazenamento simples em formato:

chave → valor

Exemplo:
"tarefas" → "[{...}]"
"nivel" → "2"
"xp" → "150"

👉 chave:
é o identificador (nome que você escolhe)

👉 valor:
é o dado salvo


📌 MÉTODOS USADOS

localStorage.setItem("chave", valor)
→ serve para SALVAR dados

localStorage.getItem("chave")
→ serve para LER dados

👉 importante:
quando salvamos usamos uma chave
e quando lemos usamos a MESMA chave


📌 PROBLEMA IMPORTANTE

localStorage só aceita STRING (texto)

Então isso NÃO funciona direto:
{ nome: "João" }
[{ id: 1 }]


📌 SOLUÇÃO (CONVERSÃO)

JSON.stringify(dado)
→ transforma objeto/array em string

JSON.parse(string)
→ transforma string de volta em objeto

👉 fluxo real:

objeto → stringify → string → parse → objeto


📌 CÓDIGO COMPLETO (COPIA E COLA)

const [tarefa, setTarefa] = useState(() => {
  const tarefasSalvas = localStorage.getItem('tarefas')
  return tarefasSalvas ? JSON.parse(tarefasSalvas) : tarefasIniciais
})

const [nivel, setNivel] = useState(() => {
  const nivelSalvo = localStorage.getItem('nivel')
  return nivelSalvo ? JSON.parse(nivelSalvo) : 1
})

const [xp, setXp] = useState(() => {
  const xpSalvo = localStorage.getItem('xp')
  return xpSalvo ? JSON.parse(xpSalvo) : 0
})

useEffect(() => {
  localStorage.setItem('tarefas', JSON.stringify(tarefa))
}, [tarefa])

useEffect(() => {
  localStorage.setItem('nivel', JSON.stringify(nivel))
}, [nivel])

useEffect(() => {
  localStorage.setItem('xp', JSON.stringify(xp))
}, [xp])


📌 EXPLICAÇÃO NA PRÁTICA (PASSO A PASSO)


🧠 1. ESTADO DE TAREFAS (PARTE MAIS IMPORTANTE)

const [tarefa, setTarefa] = useState(() => { ... })

👉 Aqui usamos uma FUNÇÃO dentro do useState

Isso faz com que:
→ esse código rode apenas UMA VEZ (quando a página abre)

Agora dentro da função:

const tarefasSalvas = localStorage.getItem('tarefas')

👉 tenta buscar dados salvos no navegador

Pode retornar:
→ string com dados
→ ou null (se nunca salvou nada)

Agora a linha principal:

return tarefasSalvas ? JSON.parse(tarefasSalvas) : tarefasIniciais

👉 isso significa:

SE existir algo salvo:
→ transforma com JSON.parse e usa isso

SE não existir:
→ usa tarefasIniciais

👉 resultado:
o estado já começa com dados salvos automaticamente


🧠 2. SALVANDO TAREFAS

useEffect(() => {
  localStorage.setItem('tarefas', JSON.stringify(tarefa))
}, [tarefa])

👉 useEffect executa sempre que "tarefa" mudar

[tarefa] significa:
→ toda vez que tarefa mudar, roda o código

Agora dentro:

JSON.stringify(tarefa)
→ transforma o array em string

localStorage.setItem('tarefas', ...)
→ salva no navegador

👉 tradução simples:
"sempre que a lista mudar, salva ela"


🧠 3. NIVEL E XP (MESMA LÓGICA)

const [nivel, setNivel] = useState(() => {
  const nivelSalvo = localStorage.getItem('nivel')
  return nivelSalvo ? JSON.parse(nivelSalvo) : 1
})

useEffect(() => {
  localStorage.setItem('nivel', JSON.stringify(nivel))
}, [nivel])

👉 aqui é exatamente o mesmo raciocínio:
- tenta carregar
- se existir usa
- se não usa valor padrão
- quando mudar → salva


const [xp, setXp] = useState(() => {
  const xpSalvo = localStorage.getItem('xp')
  return xpSalvo ? JSON.parse(xpSalvo) : 0
})

useEffect(() => {
  localStorage.setItem('xp', JSON.stringify(xp))
}, [xp])

👉 mesma coisa novamente


📌 COMO RECRIAR DO ZERO (PASSO A PASSO MENTAL)

1. Crie o estado com função
→ buscar no localStorage

2. Se existir:
→ JSON.parse

3. Se não existir:
→ valor padrão

4. Crie um useEffect
→ com dependência do estado

5. Dentro dele:
→ JSON.stringify + setItem


📌 RESUMO FINAL

getItem → lê do navegador  
setItem → salva no navegador  

JSON.stringify → objeto vira string  
JSON.parse → string vira objeto  

useState com função → carrega dados  
useEffect → salva automaticamente  

Se você seguir exatamente essa sequência,
você consegue recriar isso em qualquer projeto.
-->