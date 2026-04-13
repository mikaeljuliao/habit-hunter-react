<!--
📘 GUIA COMPLETO: COMO COMPONENTIZAR UM PROJETO EXISTENTE EM REACT

Este documento é a minha própria explicação sobre como componentizar um projeto React já existente. Criei estas anotações para que eu mesmo possa revisitar os conceitos sempre que necessário e me sentir seguro ao dividir qualquer interface em componentes reutilizáveis.


🎯 1. O QUE SIGNIFICA COMPONENTIZAR?

Componentizar é o processo de dividir uma interface grande em partes menores, independentes e reutilizáveis, cada uma responsável por uma função específica.

🧠 Analogia:
Pense em um carro. Ele não é construído como uma única peça. Existem o motor, as rodas, o volante e o painel. Cada parte tem sua função, mas juntas formam o sistema completo. No React, cada uma dessas partes é um componente.

🧭 2. QUANDO UM CÓDIGO PRECISA SER COMPONENTIZADO?

Se eu identificar qualquer uma das situações abaixo, é um forte sinal de que devo componentizar:

📏 Arquivos muito grandes (ex: mais de 150-200 linhas).
🔁 Trechos de código repetidos.
🧩 Seções visuais bem definidas (header, formulário, lista, modal).
🛠️ Dificuldade de manutenção ou leitura.
♻️ Necessidade de reutilizar partes da interface.

🪜 3. PASSO A PASSO PARA COMPONENTIZAR UM PROJETO EXISTENTE

✅ Passo 1: Identificar as Seções da Interface

Observo o layout e divido-o em blocos lógicos.

Exemplo:

Home
 ├── Header
 ├── Estatisticas
 ├── FormularioTarefa
 ├── Filtros
 ├── ListaTarefas
 │    └── ItemTarefa
 └── ModalConfirmacao

Cada bloco com uma responsabilidade clara deve se tornar um componente.

✅ Passo 2: Criar a Estrutura de Pastas

Uma organização comum é:

src/
 ├── pages/
 │    └── Home.jsx
 ├── components/
 │    ├── Header/
 │    │    └── Header.jsx
 │    ├── Estatisticas/
 │    │    └── Estatisticas.jsx
 │    ├── FormularioTarefa/
 │    │    └── FormularioTarefa.jsx
 │    ├── Filtros/
 │    │    └── Filtros.jsx
 │    ├── ListaTarefas/
 │    │    ├── ListaTarefas.jsx
 │    │    └── ItemTarefa.jsx
 │    └── ModalConfirmacao/
 │         └── ModalConfirmacao.jsx

✅ Passo 3: Extrair o JSX para um Novo Componente

Copio o trecho de JSX da Home, crio um novo arquivo `.jsx`, colo o JSX dentro de uma função e exporto o componente.

Exemplo:

export default function Header() {
  return <div>Conteúdo do Header</div>;
}

✅ Passo 4: Identificar Quais Dados o Componente Precisa

Pergunto-me:

- O componente precisa exibir alguma informação?
- Ele precisa executar alguma ação?

Tudo isso deve ser recebido via props.

Exemplo:

<Header nivel={nivel} xp={xp} />

No componente:

export default function Header({ nivel, xp }) {
  return <h1>Nível: {nivel} | XP: {xp}</h1>;
}

✅ Passo 5: Manter o Estado no Componente Pai

A regra geral é:

"Eleve o estado para o ancestral comum mais próximo" (Lifting State Up).

Se vários componentes precisam do mesmo dado, esse estado deve ficar no componente pai (no meu caso, a Home).

Exemplo:

const [tarefas, setTarefas] = useState([]);

A Home controla o estado e o distribui para os filhos.

✅ Passo 6: Passar Funções como Props

Componentes filhos não devem alterar diretamente o estado. Em vez disso, eles recebem funções do componente pai.

Exemplo:

<FormularioTarefa adicionarTarefa={adicionarTarefa} />

No filho:

<button onClick={adicionarTarefa}>Adicionar</button>

Isso mantém a aplicação organizada e previsível.

🔄 4. FLUXO DE DADOS NO REACT

O fluxo de dados é unidirecional:

Home (estado e lógica)
   ↓
ListaTarefas
   ↓
ItemTarefa

Props descem (pai → filho).
Eventos sobem (filho → pai através de funções).

🧠 5. TIPOS DE COMPONENTES

📦 Componentes Presentacionais
Apenas exibem informações e não possuem lógica complexa.
Exemplos: Header, Filtros, ModalConfirmacao.

🧠 Componentes de Lógica (Containers)
Gerenciam estados e regras de negócio.
Exemplo: Home.

🧩 6. COMPONENTES ANINHADOS

Um componente pode conter outros componentes.

Exemplo:

<ListaTarefas tarefas={tarefas}>
  <ItemTarefa />
</ListaTarefas>

A ListaTarefas é responsável pelo `map()`, enquanto o ItemTarefa cuida da exibição individual.

🎭 7. RENDERIZAÇÃO CONDICIONAL

Permite exibir elementos apenas quando necessário.

{mostrarModal && <ModalConfirmacao />}

Ou dentro do componente:

if (!aberto) return null;

💾 8. PERSISTÊNCIA DE DADOS

Para manter os dados após recarregar a página, utilizo o localStorage.

useEffect(() => {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}, [tarefas]);

Inicialização:

const [tarefas, setTarefas] = useState(() => {
  const salvas = localStorage.getItem("tarefas");
  return salvas ? JSON.parse(salvas) : [];
});

🧹 9. BOAS PRÁTICAS DE COMPONENTIZAÇÃO

✅ Responsabilidade Única  
Cada componente deve fazer apenas uma coisa.

✅ Reutilização  
Se um trecho pode ser reutilizado, transformo-o em componente.

✅ Nomes Descritivos  
Utilizo nomes que representem claramente a função do componente.

✅ Evitar Props Desnecessárias  
Passo apenas o que o componente realmente precisa.

✅ Componentes Pequenos  
Componentes menores são mais fáceis de entender e testar.

⚠️ 10. ERROS COMUNS AO COMPONENTIZAR

Erro                               | Como evitar
-----------------------------------|-------------------------------------------
Colocar toda a lógica nos filhos   | Centralizo o estado no pai
Passar props demais                | Passo apenas o necessário
Criar componentes muito genéricos  | Dou responsabilidades claras
Duplicar código                    | Extraio para um componente reutilizável
Não usar key em listas             | Sempre utilizo uma chave única

🧭 11. CHECKLIST PARA COMPONENTIZAR QUALQUER PROJETO

Uso este roteiro sempre:

🔍 Identifico as seções visuais do layout.  
✂️ Extraio cada seção para um novo arquivo `.jsx`.  
📥 Defino as props necessárias para o componente.  
🧠 Mantenho o estado no componente pai.  
🔗 Passo funções para que os filhos possam interagir com o estado.  
🔄 Testo o funcionamento após cada extração.  
♻️ Refatoro para melhorar a reutilização.  
🧹 Organizo a estrutura de pastas.

🏗️ 12. EXEMPLO PRÁTICO: ANTES E DEPOIS

❌ Antes (Monólito)

function Home() {
  return (
    <div>
      <header>...</header>
      <form>...</form>
      <ul>
        <li>...</li>
      </ul>
    </div>
  );
}

✅ Depois (Componentizado)

function Home() {
  return (
    <div>
      <Header />
      <FormularioTarefa />
      <ListaTarefas />
    </div>
  );
}

🧠 13. QUANDO USAR CONTEXT API OU REDUX?

Utilizo essas ferramentas quando:

- Muitos componentes precisam acessar o mesmo estado.
- O “prop drilling” (passagem de props por vários níveis) se torna excessivo.

Para projetos pequenos e médios, como o meu, props são suficientes.

🎓 14. RESUMO FINAL PARA O "EU DO FUTURO"

🧠 A Home é o cérebro da aplicação.  
🌉 Props são a ponte de comunicação.  
🔄 O fluxo de dados é sempre do pai para o filho.  
🧩 Componentes devem ter responsabilidade única.  
♻️ Reutilização evita duplicação de código.  
💾 O localStorage garante persistência.  
🧭 Organização é a chave para escalabilidade.

🗺️ 15. VISÃO FINAL DA ARQUITETURA

Home (Estados e Lógica)
│
├── Header
├── Estatisticas
├── FormularioTarefa
├── Filtros
├── ListaTarefas
│   └── ItemTarefa
└── ModalConfirmacao

🚀 CONCLUSÃO

Com este guia, agora tenho um passo a passo completo para componentizar qualquer projeto React existente. Ele cobre desde a identificação dos componentes até a organização da arquitetura e boas práticas.

Continuar documentando e praticando esses conceitos será fundamental para minha evolução como desenvolvedor.
-->