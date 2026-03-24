# 🚀 Guia Definitivo: Fullstack Node.js + React.js + TypeScript + Docker

Este documento serve como seu **guia base** de arquitetura e infraestrutura para novos projetos Fullstack. O foco é manutenibilidade, escalabilidade e adoção das melhores práticas do mercado, tanto no ecossistema Node.js quanto em React.

---

## 📂 1. Estrutura Raiz (Mono-repositório Simples)

A recomendação para a maioria dos projetos é ter um repositório centralizado, separando o frontend e o backend em pastas distintas e orquestrando a infraestrutura local integrada com `docker-compose`.

```text
meu-projeto/
├── backend/               # API em Node + Express + TS (Clean Architecture)
├── frontend/              # SPA em React + Vite + TS (Feature-based Architecture)
├── docker-compose.yml     # Orquestrador local (Sobe o BD ou todo ecossistema)
└── README.md
```

---

## ⚙️ 2. Backend (Node.js + Express)

### Inicialização e Dependências
Entrando na pasta `backend/`:
```bash
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node-dev
npx tsc --init
```

### Arquitetura Backend (Clean Architecture + SOLID)
Separamos as responsabilidades para aplicar **Inversão e Injeção de Dependências**, desacoplando sua lógica de negócio de frameworks e bancos de dados externos:

```text
backend/src/
├── domain/          # Modelos (User) e Interfaces de Repositório (IUserRepository)
├── application/     # Casos de Uso (Ex: CreateUserUseCase, orquestram o fluxo)
├── infrastructure/  # Implementações REAIS (PostgresUserRepository), ORMs (Prisma)
├── presentation/    # Rotas do Express e Controllers (Lidam com Request/Response)
└── main.ts          # Composition Root (Injeta o Repo no UseCase e o UseCase no Controller)
```
*(Nota: Lembre-se, a camada de Casos de Uso só importa Interfaces `IUserRepository`, nunca as implementações literais de banco de dados diretamente.)*

---

## 🎨 3. Frontend (React + Vite)

### Inicialização e Dependências Principais
Entrando na pasta `frontend/`:
```bash
npx create-vite@latest . --template react-ts
npm install
```

**Bibliotecas Essenciais:**
```bash
# Roteamento e Requisições
npm install react-router-dom axios @tanstack/react-query

# Gerenciador de Estado Global
npm install zustand 

# Formulários e Validação Tipada
npm install react-hook-form zod @hookform/resolvers

# Estilização / CSS (Se optar pelo TailwindCSS)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*Explicação:*
- `Vite`: Tooling veloz, padrão de mercado atual para criar React apps.
- `@tanstack/react-query`: Essencial! Sincroniza, gerencia estado e faz cache de requisições do seu Backend ("Server State").
- `zustand`: Gerenciador de "Client State" (tema global, usuário logado, barra lateral aberta). Mais direto e performático que Redux.
- `react-hook-form + zod`: Facilita criar forms escaláveis e validados com as mesmas tipagens TS de entrada do servidor.

### Arquitetura Frontend (Feature-Based Design)
Esqueça a separação rígida por tipo de arquivo (todas as rotas numa pasta, todos os serviços em outra). Escale utilizando **Módulos por Feature**:

```text
frontend/src/
├── assets/          # Imagens, SVGs
├── components/      # Componentes UI globais/Dumb (Button, Input, Layouts)
├── config/          # Instâncias únicas configuradas (Axios instance, QueryClient)
├── features/        # Módulos principais separados por "domínio" da UI
│   └── users/
│       ├── api/         # Chamadas ao server para esse domínio (ex: getUsers.ts)
│       ├── components/  # UIs Específicas (ex: UsersList.tsx, UserCard.tsx)
│       ├── hooks/       # Hooks de manipulação local e React Query wrappers
│       └── types/       # Tipagens locais
├── hooks/           # Custom Hooks utilitários globais (useTheme, useLocalStorage)
├── pages/           # Views/Páginas completas. Montam blocos das features juntas
├── routes/          # Arquivos e hierarquia de roteamento central
├── store/           # Setup do Zustand
└── utils/           # Funções genéricas puras e helpers
```

### Melhores Práticas React
1. **Evite `useEffect` para fetch de dados simples:** O Hook `useEffect` tende a gerar vazamentos e repetições de lógica. Substitua seus usos para Fetch pelo `@tanstack/react-query`.
2. **Separe Componentes Inteligentes vs "Dumb":** Os botões, formulários textuais e Cards (`components/`) só recebem propriedades visuais e eventos. Suas Pages ou Container Components são quem gerenciam o Fetch e os enviam `props` dados preenchidos.
3. **Extração de Lógica (Custom Hooks):** View não mistura com regras de tela grandes demais. Se o componente crescer com múltiplos states e actions, retire a engine criando um arquivo `useSeuComponenteLogic.ts`.
4. **Code Splitting (Lazy Loading):** Se sua aplicação for gigante, nas `routes`, carregue as páginas sob-demanda com `React.lazy()` para tempo de "First Load" reduzido na aba Network.

---

## 🐳 4. Docker e Docker Compose (Ecossistema Integrado)

O isolamento garante que o dev de Frontend não precisa configurar Node na máquina, e nem o dev Backend precisa de NPM no dele.

### Dockerfile do Backend (`backend/Dockerfile`)
```dockerfile
# Multi-stage build focado no Node (Gera container mínimo sem node_modules desnecessários)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Dockerfile do Frontend (`frontend/Dockerfile`)
*(Atenção: Apenas recomendado usar dockerfile se for fazer self-host direto na mesma VPS e não usando uma Vercel).*
Faz o build estático e hospeda leve num **Nginx**.

```dockerfile
# 1: Build React
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2: Serve via Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
# Para lidar com Rotas do React (fallback 404), é preciso o nginx.conf correspondente
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml` (Na Raiz)
Traz o banco, api e frontend num só comando na máquina local.

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: dev_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: 
      context: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://root:pass@db:5432/dev_db
    depends_on:
      - db

  frontend:
    # No dev o front geralmente roda local no vite via npm run dev na máquina do Host.
    # Mas aqui configuramos para ele subir o contêiner se necessário.
    build: 
      context: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

---

## 🚀 5. Deploy Real (Produção)

Não confunda ambiente Docker Local do compose com onde cada pedaço da Stack será hospedado. Os serviços ganham resiliência quando separados.

### 1. Deploy Frontend React (Jamstack)
Evite servir o Front a partir do mesmo servidor Express/Docker na mesma porta, isso penaliza a latência. 
Delegue seus arquivos React estáticos (a pasta local `dist`) para grandes **CDNs (Content Delivery Networks)** mundiais.
- **Vercel, Netlify, Cloudflare Pages:** Integração fantástica. Eles conectam no GitLab/GitHub, executam seu `npm run build` na nuvem e pulverizam a SPA nos seus datacenters com Autenticação SSL automática. É GRÁTIS na maior parte, ágil e altamente preferencial.
- **Cloud:** Você pode botar o build num S3 + CloudFront (AWS).  

### 2. Deploy do Backend Express
- **Plataformas Gerenciadas (PaaS) - Ex: Render, Railway, AppRunner:** Conectam com seu GitHub, leem a pasta `backend/` e o `Dockerfile`, sobem seu NodeJS sem precisar configurar SSH de servidor Linux.
- **VPS (IaaS) - Hetzner, AWS EC2, DigitalOcean:** O melhor preço x performance. Assina uma máquina por ~5$, coloca o código via git, executa o contêiner via `Docker` manualmente e coloca um **Nginx** fazendo *Proxy Reverso* + *Let's Encrypt para HTTPS*.

### 3. Banco de Dados SQL
Manter banco de forma confiável num container VPS cru é arrancar os próprios cabelos em longo prazo caso não seja expert em DevOps. Para Produção é ideal delegar e pagar:
- Supabase (Postgres gerenciado).
- Neon.tech (Postgres Serverless incrível p/ testes e startups liberais).
- AWS RDS ou Render Postgres Database.
