# 🎮 Habit Hunter

Aplicação web desenvolvida com foco em **lógica de negócio, gerenciamento de estado e componentização**, transformando tarefas do dia a dia em um sistema de progressão estilo jogo.

O projeto simula um sistema onde o usuário evolui ao completar tarefas, acumulando XP, subindo de nível e lidando com falhas diárias.

---

## 🚀 Demo

🔗 https://habit-hunter.netlify.app/

---

## 📌 Objetivo do projeto

Desenvolver uma aplicação com regras de negócio mais elaboradas, simulando um sistema real de progressão, com foco em:

- Gerenciamento de estado mais complexo  
- Aplicação de lógica baseada em datas  
- Organização e escalabilidade de código  
- Componentização eficiente  

---

## 🧠 Decisões técnicas

Durante o desenvolvimento, foram priorizados:

- Separação entre lógica e interface  
- Organização de estados de forma previsível  
- Criação de funções utilitárias para regras de negócio (XP, níveis)  
- Persistência de dados no client para simular comportamento real  
- Estrutura de pastas voltada para escalabilidade  

---

## 🔥 Principais funcionalidades

- Sistema de XP e progressão de níveis  
- Controle de tarefas com filtros por tipo  
- Registro de falhas diárias baseado em data  
- Histórico de execuções  
- Exclusão e gerenciamento de tarefas  
- Persistência de dados no navegador  

---

## 🛠️ Tecnologias utilizadas

- React  
- JavaScript (ES6+)  
- Tailwind CSS  

---

## 🧠 Conceitos aplicados

- Gerenciamento de estado com React Hooks  
- Criação de hooks customizados (useLocalStorage)  
- Persistência de dados no client (LocalStorage)  
- Lógica de negócio (XP, níveis e regras baseadas em data)  
- Componentização e separação de responsabilidades  

---

## 📂 Estrutura do projeto

A estrutura foi organizada visando **manutenção, clareza e separação de responsabilidades**:

```bash
src/
  assets/              # Imagens e arquivos estáticos
  components/          # Componentes reutilizáveis
    Estatisticas/
    Filtros/
    FormularioTarefa/
    Header/
    Historico/
    ListaTarefas/
    ModalConfirmacao/
    ModalSemanal/
  hooks/               # Hooks customizados
  pages/               # Páginas da aplicação
  utils/               # Funções utilitárias (ex: cálculos de XP)
  App.jsx
  App.css