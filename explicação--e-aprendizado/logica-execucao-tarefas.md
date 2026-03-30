<!--

30/03/2026

# 🧠 Sistema de Execução de Tarefas (Lógica Completa)

## 📌 Objetivo

Aqui eu implementei a lógica de **completar tarefas de forma inteligente**, permitindo:

* Marcar tarefa como feita
* Desmarcar (caso clique sem querer)
* Evitar duplicação no mesmo dia
* Controlar XP corretamente
* Salvar histórico de execuções


# 🧩 Conceito principal

Eu separei o sistema em duas partes:

### 📌 1. Tarefas (`tarefa`)

São fixas, representam o que existe:

```js
{
  id: 1,
  title: "treinar",
  xp: 50,
  type: "diaria"
}
```



### 📌 2. Execuções (`execucoes`)

Representam quando a tarefa foi feita:

```js
{
  tarefaId: 1,
  date: "2026-03-30",
  xp: 50
}
```

👉 Ou seja:

> A tarefa existe independente de ser feita
> A execução registra QUANDO ela foi feita


# 💾 Persistência (LocalStorage)

As execuções são salvas assim:

```js
const [execucoes, setExecucoes] = useState(() => {
  const execucoesSalvas = localStorage.getItem('chaveExecucao')
  return execucoesSalvas ? JSON.parse(execucoesSalvas) : []
})
```

E sempre que muda:

```js
useEffect(() => {
  localStorage.setItem('chaveExecucao', JSON.stringify(execucoes))
}, [execucoes])
```



# ⚙️ Função principal: completar/desfazer tarefa

```js
const completarTarefa = (id) => {
  const tarefaEncontrada = tarefa.find((t) => t.id === id)

  if (!tarefaEncontrada) return

  const hoje = new Date().toISOString().split("T")[0]

  const jaExecutouHoje = execucoes.some(
    (e) => e.tarefaId === id && e.date === hoje
  )

  if (jaExecutouHoje) {
    // DESFAZER
    setExecucoes(
      execucoes.filter(
        (e) => !(e.tarefaId === id && e.date === hoje)
      )
    )

    setXp(xp - tarefaEncontrada.xp)
    return
  }

  // FAZER
  ganharXp(tarefaEncontrada.xp)

  setExecucoes([
    ...execucoes,
    {
      tarefaId: id,
      date: hoje,
      xp: tarefaEncontrada.xp
    }
  ])
}
```



# 🔍 Explicação DETALHADA (linha por linha)



## 🔹 1. Encontrar a tarefa

```js
const tarefaEncontrada = tarefa.find((t) => t.id === id)
```

👉 Procura dentro da lista de tarefas aquela com o mesmo `id`.



## 🔹 2. Segurança

```js
if (!tarefaEncontrada) return
```

👉 Se não encontrou, para tudo (evita erro).



## 🔹 3. Pegar data de hoje

```js
const hoje = new Date().toISOString().split("T")[0]
```

👉 Resultado:


"2026-03-30"
```

👉 Isso padroniza a data (muito importante pra comparação).



## 🔹 4. Verificar se já foi feita hoje

```js
const jaExecutouHoje = execucoes.some(
  (e) => e.tarefaId === id && e.date === hoje
)
```



### 🧠 O que é `.some()`?

`.some()` verifica se **existe pelo menos um item** no array que atende a condição.



### 📦 Exemplo simples:

```js
[1, 2, 3].some(n => n === 2)
```

👉 Resultado:


true




### 📌 No meu caso:

```js
(e) => e.tarefaId === id && e.date === hoje
```

👉 Tradução:

> "Existe alguma execução dessa tarefa hoje?"



## 🔹 5. Se já fez → DESFAZER

```js
if (jaExecutouHoje)


👉 Se já existe registro hoje, então vou remover.



### 🔥 Aqui entra o `filter`

```js
execucoes.filter(
  (e) => !(e.tarefaId === id && e.date === hoje)
)
```



## 🧠 Entendendo o `filter`

O `filter` mantém apenas os itens que retornam `true`.



### ❌ Sem `!`:

```js
(e) => e.tarefaId === id && e.date === hoje
```

👉 manteria só o item que quero remover



### ✅ Com `!`:

```js
!(condição)


👉 significa:

> "tudo que NÃO for isso"



### 💥 Tradução final:

```js
(e) => !(e.tarefaId === id && e.date === hoje)
```

👉 "remove exatamente essa execução de hoje"



## 🔹 6. Remover XP

```js
setXp(xp - tarefaEncontrada.xp)


👉 Ao desfazer, o XP ganho também é removido.



## 🔹 7. Se NÃO fez → EXECUTAR

```js
ganharXp(tarefaEncontrada.xp)


👉 Adiciona XP.



## 🔹 8. Registrar execução

```js
setExecucoes([
  ...execucoes,
  {
    tarefaId: id,
    date: hoje,
    xp: tarefaEncontrada.xp
  }
])




### 🧠 Aqui é onde a execução nasce

👉 Esse objeto NÃO existia antes

👉 Ele é criado no momento que o usuário completa a tarefa



# 🎨 Renderização (UI)

Dentro do `.map()`:

```js
{tarefaFiltrada.map((item) => {

  const hoje = new Date().toISOString().split("T")[0]

  const jaFeitaHoje = execucoes.some(
    (e) => e.tarefaId === item.id && e.date === hoje
  )




## 🧠 Por que dentro do `.map()`?

👉 Porque `item` só existe ali

Cada tarefa precisa verificar individualmente se foi feita hoje.



## 🎯 Aplicação na interface

```js
{jaFeitaHoje && <CheckCircle2 />}


👉 mostra check se foi feita



```js
<p className={jaFeitaHoje ? "line-through" : ""}>


👉 risca o texto



# 🧠 Conclusão

Esse sistema implementa:

* Separação de dados (tarefa vs execução)
* Controle por data
* Evita duplicação
* Permite desfazer ação
* Persistência no navegador
* Lógica escalável (pronto pra histórico e estatísticas)



# 🚀 Evoluções futuras

* Histórico por dia
* Streak (dias seguidos)
* Gráficos de produtividade
* Sistema de conquistas



# 🏁 Resumo final

> Eu não marco a tarefa como concluída diretamente.
> Eu registro que ela foi executada em um determinado dia.



>