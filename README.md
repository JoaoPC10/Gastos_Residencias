# 💰 Gastos Residenciais

Sistema web desenvolvido para auxiliar no controle e gerenciamento de despesas financeiras familiares, permitindo o cadastro de pessoas, categorias e gastos, proporcionando uma visão organizada das finanças da residência.

---

## 📋 Sobre o Projeto

O **Gastos Residenciais** é uma aplicação Full Stack composta por uma API em **ASP.NET 8** e um frontend em **React + TypeScript**.

O objetivo do sistema é facilitar o registro e acompanhamento das despesas de uma família, permitindo uma gestão financeira simples, organizada e intuitiva.

### Funcionalidades

- 👤 Cadastro de pessoas
- ✏️ Edição de pessoas
- 🗑️ Exclusão de pessoas
- 💸 Cadastro de transações
- 📂 Organização por categorias
- 📊 Visualização das transações cadastradas
- 🔗 Comunicação entre Frontend e Backend através de API REST

---

# 🛠️ Tecnologias Utilizadas

## Backend

- ASP.NET 8
- C#
- Entity Framework Core
- SQLite

## Frontend

- React
- TypeScript
- Vite
- CSS

---

# 📦 Pré-requisitos

Antes de iniciar o projeto, certifique-se de possuir instalado:

- .NET SDK 8
- Node.js 20+
- npm
- Git

No Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y

# Instalar .NET 8
sudo apt install dotnet-sdk-8.0 -y

# Instalar Node.js (caso não possua)
sudo apt install nodejs npm -y
```

---

# 🚀 Executando o Projeto

## 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>

cd Gastos-Residenciais
```

---

## 2. Executando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Execute a aplicação:

```bash
dotnet run
```

A API estará disponível normalmente em:

```
http://localhost:5137
```

---

## 3. Executando o Frontend

Abra outro terminal.

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

O frontend estará disponível em:

```
http://localhost:5173
```

---

# 🏗️ Arquitetura

```text
GASTOS_RESIDENCIAS/
│
├── backend/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Properties/
│   ├── Routes/
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── gastos.sqlite
│   ├── GastosResidencias.csproj
│   ├── GastosResidencias.http
│   └── Program.cs
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── eslint.config.js
│
└── README.md
```

---

# 📌 Funcionalidades Planejadas

- Relatórios 
- Controle de receitas
- Controle de despesas
- Cadastro dos membros da família
- Somente maiores de 18 anos podem contribuir na receita familiar

---

# 👨‍💻 Desenvolvedor

Desenvolvido por **João Igor Pereira da Costa**.

---

# 🚨 Nota do desenvolvedor:
Acredito que o atributo Idade para a Pessoa um boa ideia, mas que poderia ser diferente, pensando em continuidade e escalabilidade do sistema o atributo Idade fica obsoleto, pois o tempo passa e caso a pessoa seja de menor no momento do cadastro no sistema, em algum momento, se ela continuar existindo nele, era será de maior, portando eu mudaria o atributo Idade para Data de Nascimento, assim o cálculo da idade seria automático, sem precisar de ajustes manuais dentro do código do sistema.

Indo pela mesma linha de raciocínio, talvez, fosse possível colocar um área de despesas e ganhos para cada usuário, pois assim eles teriam o controle das próprias finanças, podendo aceitar membros com menos de 18 anos, pois ele podem começar a receber mesada dos pais, ou começar a trbalhar de Jovem Aprendiz 
