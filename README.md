# Recicla Entulhos ♻️

Um sistema moderno, rápido e seguro para gerenciamento completo de locações de caçambas de entulho.

![Status: Ativo](https://img.shields.io/badge/Status-Active-emerald)
![Licença: MIT](https://img.shields.io/badge/Licence-MIT-blue)

## 📋 Sobre o Projeto

O **Recicla Entulhos** é uma plataforma desenvolvida para facilitar a gestão de frotas de caçambas, controlando status (disponível/alugada), histórico de endereço das locações (integrado ao ViaCEP) e controle de usuários do sistema de administração (painel restrito).

A arquitetura do projeto é dividida em dois ecossistemas principais, além da conteinerização total pelo Docker.

## 🚀 Tecnologias

A stack de tecnologia foi pensada visando **alta performance**, **tipagem estática forte** e as **melhores práticas** (Server-Side Rendering, Server Actions, Padrão Repository).

### Frontend (User Interface)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS (Abordagem de componentes premium e glassmorphism)
- **Autenticação**: Cookies nativos no Servidor (`js-cookie` + Next.js Middleware/Proxy)
- **Gerenciamento de Estado/Cache**: Server Components, Server Actions e React Query (Transição para server-first)
- **Validação de Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

### Backend (API e Dados)
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Linguagem**: TypeScript
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Bancos de Dados**: PostgreSQL 15
- **Segurança**: JWT (JSON Web Tokens), Class Validator, Bcrypt
- **Arquitetura**: Modular, Injeção de Dependências e Padrão Repository rigoroso para acesso aos dados.

### DevSecOps e Infraestrutura
- **Containers**: Docker e Docker Compose
- **Node**: v20 (Imagens otimizadas `node:20-slim`)
- **Padronização**: ESLint, Prettier e TypeScript Strict Mode
- **Git**: Conventional Commits estruturados

---

## ⚙️ Como Executar o Projeto

Todo o ambiente está preparado e orquestrado no Docker, eliminando a necessidade de instalar bancos de dados localmente.

### 1. Pré-requisitos
- [Docker](https://www.docker.com/) instado no seu sistema.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

### 2. Subindo a Aplicação
No diretório raiz do projeto (onde o arquivo `docker-compose.yml` está), rode o seguinte comando:

```bash
docker compose up -d --build
```
*O parâmetro `-d` roda o processo em background e `--build` garante a construção da versão mais recente do código.*

Aguarde a finalização. O Docker irá subir:
1. O banco de dados PostgreSQL.
2. A API do NestJS (que vai rodar as *migrations* e o *seed* automaticamente).
3. O Frontend Next.js.

### 3. Acessando a Plataforma

Com tudo rodando, acesse no seu navegador:

- **Frontend (Painel Administrativo)**: [http://localhost:4000](http://localhost:4000)
- **Backend (API Base URL)**: [http://localhost:3000/api](http://localhost:3000/api)

### 4. Credenciais Padrão (Seed)
A API inicializa automaticamente um usuário administrador se o banco estiver vazio. Você pode usá-lo para acessar a plataforma:

- **E-mail**: `admin@recicla.com`
- **Senha**: `admin` *(verifique em `backend/prisma/seed.ts` se alterado no código-fonte).*

---

## 🛠️ Principais Funcionalidades

- **Autenticação via Proxy Server**: As rotas protegidas não chegam ao cliente sem permissão - o Next.js Middleware barateia o processo rejeitando no lado do servidor.
- **Integração com ViaCEP**: Busca automática de endereços ao digitar o CEP no aluguel da caçamba.
- **Dashboard e Histórico Paginado**: Renderização robusta com a performance e SEO dos Next.js Server Components.
- **Validação e Tipagem Compartilhada**: Backend e Frontend falam o mesmo idioma, mitigando erros lógicos através de DTOs e Interfaces firmes no TypeScript.

---

## 🛑 Parando os Serviços

Caso queria desligar os containers e liberar as portas:

```bash
docker compose down
```
*(Para excluir os volumes do banco de dados permanentemente e "resetar" os dados, adicione a flag `-v`)*
