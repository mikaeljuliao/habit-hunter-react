<!--
📘 COMPONENTIZAÇÃO — A ARTE DE DIVIDIR PARA CONQUISTAR

Neste projeto eu revisei conceitos basicos de componetização, props,estados, hooks, 
redenrização e etc, então coloquei em anotação pra facilitar futuros projetos.

==============================
🎯 OBJETIVO
==============================

Transformar um código gigante ("Monólito") em peças menores e organizadas ("Peças de Lego").
O foco é facilitar a leitura, manutenção e permitir que cada parte do site cuide apenas da sua responsabilidade.

---

==============================
🧱 1. O QUE É COMPONENTIZAÇÃO?
==============================

Imagine que você está montando um computador.
Você não compra um bloco único de metal.
Você compra:
- Placa-Mãe
- Processador
- Memória RAM
- Placa de Vídeo

Cada uma funciona sozinha, mas quando conectadas, formam o sistema.
No React, fazemos o mesmo com o HTML/JSX.

---

==============================
🧱 2. A "HOME" É O CÉREBRO (PARENT)
==============================

Mantivemos toda a "inteligência" no arquivo principal (`Home.jsx`).

👉 Por que? 
Para termos uma **Fonte Única de Verdade** (Single Source of Truth).
Se o XP mudar, todos os componentes que precisam de XP saberão na hora porque o estado original mora aqui.

📌 O QUE A HOME FAZ:
- Guarda os `useState`
- Faz os `useEffect` (LocalStorage/Checagem)
- Tem as funções que "fazem coisas" (`adicionarTarefa`, `ganharXp`)
- Passa essas informações para os filhos via **PROPS**.

---

==============================
🧱 3. O QUE SÃO PROPS? (A PONTE)
==============================

Props são como tubos que levam dados do Cérebro (Pai) para os Membros (Filhos).

🧠 EXEMPLO REAL:
Na Home temos:
`<FormularioTarefa novaTarefa={novaTarefa} setNovaTarefa={setNovaTarefa} />`

👉 Tradução:
"Ei, Formulário! Estou te emprestando o meu estado `novaTarefa` e a minha função `setNovaTarefa`. Use-os bem!"

---

==============================
🧱 4. QUEBRANDO O MONÓLITO (PASSO A PASSO)
==============================

Identificamos 5 grandes blocos no `Home2.jsx` e os separamos em arquivos próprios:

🔹 1. Header (Topo do App)
🔹 2. FormularioTarefa (Criação de Missões)
🔹 3. Filtros (Abas de Categoria)
🔹 4. ListaTarefas (Onde tudo aparece)
🔹 5. ModalConfirmacao (A segurança do usuário)

---

==============================
🧱 5. ANATOMIA DE UM SUB-COMPONENTE
==============================

Vamos ver como ficou o `FormularioTarefa.jsx`:

```javascript
export const FormularioTarefa = ({ novaTarefa, setNovaTarefa, adicionarTarefa, xpPorTipo }) => (
  <div className="bg-zinc-900 rounded-xl p-4 ...">
     <input 
        value={novaTarefa} 
        onChange={(e) => setNovaTarefa(e.target.value)} 
     />
     <button onClick={adicionarTarefa}> <Plus /> </button>
  </div>
);
```

🧠 O QUE ACONTECEU AQUI?
- O componente é uma constante (`export const`).
- Ele recebe os objetos entre chaves `{ ... }` → isso é a **Desestruturação das Props**.
- Ele não CRIA nada, ele apenas USA o que recebeu da Home.

---

==============================
🧱 6. COMPONENTES DENTRO DE COMPONENTES (ANINHAMENTO)
==============================

Isso aqui é o nível mestre!
Fizemos a `ListaTarefas` chamar o `ItemTarefa`.

👉 Estrutura:
Home -> ListaTarefas -> ItemTarefa 

🧠 POR QUE ISSO É GENIAL?
- A **Lista** cuida do `map()` (quem se repete na tela).
- O **Item** cuida apenas do visual de uma única missão.

📌 FLUXO DE DADOS:
1. Home passa a lista de `tarefa` para a **Lista**.
2. A **Lista** faz o loop e, para cada tarefa, chama um **Item**.
3. O **Item** recebe os dados daquela missão específica e renderiza.

---

==============================
🧱 7. TRATANDO LÓGICAS COMPLEXAS COMO PROPS
==============================

No `ItemTarefa.jsx`, precisávamos saber se a tarefa "perdeuOntem" ou está "expirada".
Essas contas são feitas DENTRO do loop da lista e passadas como props simples.

⚙️ Lógica no Pai (ListaTarefas):
```javascript
const jaFeitaHoje = execucoes.some(e => e.tarefaId === item.id);
<ItemTarefa jaFeitaHoje={jaFeitaHoje} ... />
```

🛠️ Uso no Filho (ItemTarefa):
```javascript
{jaFeitaHoje ? <CheckCircle2 /> : <Circle />}
```

👉 O Filho não precisa saber COMO calcular se foi feita hoje. 
Ele só recebe um "SIM" ou "NÃO" (Boolean) e troca o ícone. Isso é Clean Code!

---

==============================
🧱 8. O MODAL: O COMPONENTE TEMPORÁRIO
==============================

O `ModalConfirmacao` é especial porque ele só aparece se `aberto={true}`.

📌 COMO FIZEMOS:
No Pai: `{mostrarModal && <ModalConfirmacao />}`
Isso se chama **Renderização Condicional**.

O modal recebe funções para confirmar ou cancelar.
Quando o usuário clica em "Confirmar" no modal, ele dispara a função que está lá na Home!

---

==============================
🧠 RESUMO PARA O "EU DO FUTURO"
==============================

Siga esse roteiro quando o código estiver um caos:

✅ 1. **Mapeie**: Olhe o HTML e veja onde começam e terminam as seções lógicas.
✅ 2. **Extraia**: Copie o bloco de HTML para um novo arquivo `.jsx` na pasta `components`.
✅ 3. **Defina Props**: Veja no HTML quais variáveis (ex: `xp`, `tarefa`) aquele bloco usa e coloque-as como props do componente.
✅ 4. **Importe**: No arquivo Pai, delete o HTML antigo e importe o novo componente.
✅ 5. **Conecte**: Passe os dados do estado para o componente via props.

⚠️ DICA DE OURO:
Se você tiver que passar props por muitos níveis (ex: Pai -> Filho -> Neto -> Bisneto), talvez seja hora de usar um **Contexto** ou **Redux**, mas para esse projeto, as props são o caminho mais rápido e performático!

---

==============================
🧠 VISÃO FINAL DA ARQUITETURA
==============================

[  Home.jsx (Estadão/Lógica)  ]
          |
    -------------------------------------------------
    |             |             |             |     |
 [Header] [Formulario] [Filtros] [Lista] [Modal]
                                     |
                                 [Item]

---
-->
