# 📋 Histórico de Ordens de Manutenção (OMs) de Equipamentos

Aplicação fullstack para visualizar e gerenciar o histórico de Ordens de Manutenção de equipamentos industriais. O usuário escaneia um QR Code colado no equipamento (ou busca manualmente) e acessa a tabela de OMs daquele equipamento.

---

## 🏗️ Arquitetura

O backend segue **Clean Architecture** com inversão e injeção de dependências manual:

```
server/src/
├── domain/           # Entidades e Interfaces (coração, zero dependências)
│   ├── entities/     # MaintenanceOrder (tipo + mapeamento de colunas do Excel)
│   └── repositories/ # IMaintenanceOrderRepository (contrato)
├── app/              # Casos de Uso (orquestram regras de negócio)
│   └── use-cases/    # ListHistoryUseCase, AddOrderUseCase, ListEquipmentsUseCase
├── infra/            # Implementações concretas
│   └── repositories/ # ExcelOrderRepository (lê/escreve arquivos .xlsx)
├── presentation/     # Controllers (HTTP Request → Response)
│   └── controllers/  # HistoryController
├── main/             # Composition Root (injeção de dependência)
│   ├── factories.ts  # Instancia Repository → UseCases → Controller
│   └── routes.ts     # Define rotas Express
└── index.ts          # Entry point — inicializa Express
```

**Frontend** usa React + Vite + TypeScript com roteamento por slug:

```
client/src/
├── components/       # Componentes reutilizáveis (AddOrderModal)
├── pages/            # HomePage (busca), HistoryPage (tabela de OMs)
├── services/         # api.ts (chamadas fetch ao backend)
├── App.tsx           # Roteamento (/ e /equipamento/:slug)
├── index.css         # Design system (tema escuro premium)
└── main.tsx          # Entry point React
```

### Diagrama de Dependências

```
main/ (Composition Root)
  └─ cria → ExcelOrderRepository
  └─ cria → UseCases (injetando Repository)
  └─ cria → HistoryController (injetando UseCases)
  └─ registra → Routes no Express

Fluxo de uma requisição:
  HTTP Request → Route → Controller → UseCase → Repository → Excel File
```

> **Regra fundamental:** Camadas internas (domain, app) **nunca** importam camadas externas (infra, presentation). A inversão é feita via interfaces no `domain/` e injeção no `main/`.

---

## 📊 Base de Dados (Arquivos Excel)

A aplicação usa **um arquivo `.xlsx` por equipamento**, armazenados na pasta `server/data/`.

### Como inserir a base de dados

1. Para cada equipamento, crie um arquivo `.xlsx` com o nome desejado (slug):
   ```
   server/data/
   ├── geradorkm213.xlsx
   ├── turbinakm500.xlsx
   └── compressorkm102.xlsx
   ```

2. **Cada arquivo deve ter uma planilha** com as seguintes colunas (exatamente como abaixo):

   | Coluna no Excel | Descrição |
   |---|---|
   | Ordem | Número da ordem de manutenção |
   | Data base de início | Data de início planejada |
   | Data base de fim | Data de fim planejada |
   | Local de instalação | Código do local |
   | Tipo de ordem | Ex: PM01, PM02, etc. |
   | Texto breve | Descrição resumida |
   | Status usuário | Status atual |
   | Denominação do loc.instalação | Nome descritivo do local |
   | Data da entrada | Data de entrada da ordem |
   | Centro de trabalho | Centro de trabalho executor |
   | Tipo de prioridade | Classificação de prioridade |
   | Centro trab.responsável | Centro responsável |
   | Prioridade | Nível de prioridade |

3. O nome do arquivo (sem `.xlsx`) é o **slug** usado nas URLs e QR codes.

> **Dica:** Você pode exportar os dados diretamente do SAP/sistema de manutenção em formato Excel e salvar na pasta `data/`.

---

## 🔗 QR Codes

Cada equipamento tem um QR Code que aponta para:

```
https://seu-dominio.com/equipamento/<slug>
```

**Exemplo:** Para o equipamento `geradorkm213`:
- URL do QR Code: `https://seu-dominio.com/equipamento/geradorkm213`
- Arquivo Excel correspondente: `server/data/geradorkm213.xlsx`

Para gerar QR Codes, basta usar qualquer gerador online (ex: [qr-code-generator.com](https://www.qr-code-generator.com/)) com a URL do equipamento.

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm instalado

### 1. Backend
```bash
cd server
npm install
npm run dev
```
O servidor estará disponível em `http://localhost:3000`.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:5173`.

### 3. Testar a API
```bash
# Listar equipamentos disponíveis
curl http://localhost:3000/api/equipments

# Listar OMs de um equipamento
curl http://localhost:3000/api/history/arquivo_teste

# Adicionar uma nova OM
curl -X POST http://localhost:3000/api/history/arquivo_teste \
  -H "Content-Type: application/json" \
  -d '{"ordem":"OM999","dataInicio":"2026-03-23","tipoOrdem":"PM01","textoBreve":"Teste"}'
```

---

## 🐳 Docker (Rodar com containers)

### Pré-requisitos
- Docker e Docker Compose instalados

### Subir tudo com um comando
```bash
docker-compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000 |

> Os arquivos Excel ficam montados como volume em `./server/data`, então persistem mesmo após reiniciar os containers.

### Parar os containers
```bash
docker-compose down
```

---

## 🌐 Deploy em Produção

### Opção 1: VPS (Hetzner, DigitalOcean, AWS EC2) — Recomendado para este projeto

1. **Provisione uma VPS** com Ubuntu 22.04+ (mínimo 1GB RAM)

2. **Instale Docker e Docker Compose:**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. **Clone/copie o projeto para a VPS:**
   ```bash
   git clone <seu-repo> /opt/historico-oms
   cd /opt/historico-oms
   ```

4. **Configure o URL da API no frontend:**
   Crie o arquivo `client/.env.production`:
   ```env
   VITE_API_URL=https://seu-dominio.com
   ```

5. **Suba os containers:**
   ```bash
   docker-compose up -d --build
   ```

6. **Configure Nginx como Proxy Reverso + HTTPS (na VPS):**
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
   
   Crie `/etc/nginx/sites-available/historico-oms`:
   ```nginx
   server {
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/historico-oms /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

### Opção 2: PaaS (Render, Railway)

- **Backend:** Conecte o repositório, aponte para a pasta `server/`, use o Dockerfile
- **Frontend:** Faça deploy na Vercel ou Netlify (conecta ao GitHub, faz build automático)

### Opção 3: Render (tudo junto)

1. Crie um **Web Service** no Render apontando para `server/`
2. Crie um **Static Site** no Render apontando para `client/`
3. Configure o `VITE_API_URL` no build do Static Site

---

## 📁 Estrutura Final do Projeto

```
Projeto_historico_OMs_equipamentos/
├── server/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── domain/             # Entidades e Interfaces
│   │   ├── app/                # Casos de Uso
│   │   ├── infra/              # ExcelOrderRepository
│   │   ├── presentation/       # Controllers
│   │   ├── main/               # Factories + Routes
│   │   └── index.ts            # Entry point
│   ├── data/                   # Arquivos .xlsx (1 por equipamento)
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── client/                     # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/         # AddOrderModal
│   │   ├── pages/              # HomePage, HistoryPage
│   │   ├── services/           # api.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md                   # Este arquivo
```

---

## 🔧 Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/equipments` | Lista slugs de equipamentos disponíveis |
| `GET` | `/api/history/:slug` | Lista OMs do equipamento |
| `POST` | `/api/history/:slug` | Adiciona nova OM ao equipamento |

---

## 📝 Tecnologias

- **Backend:** Node.js, Express, TypeScript, xlsx (SheetJS)
- **Frontend:** React, Vite, TypeScript, React Router
- **Infra:** Docker, Docker Compose, Nginx
- **Arquitetura:** Clean Architecture, SOLID, Dependency Injection
