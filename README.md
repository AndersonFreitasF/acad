# Sistema de Gestão de Treinos/Academia

Sistema completo para gestão de treinos entre professores e alunos, com catálogo de treinos, exercícios, pagamentos via PIX/Cartão e dashboards por tipo de usuário.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Papéis e Permissões](#-papéis-e-permissões)
- [Design System](#-design-system)

---

## 🛠 Tecnologias

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **NestJS** | Framework Node.js para APIs escaláveis |
| **PostgreSQL** | Banco de dados relacional |
| **JWT** | Autenticação stateless |
| **Argon2** | Hash seguro de senhas |
| **Vitest** | Testes unitários |
| **Docker** | Containerização |
| **Asaas** | Gateway de pagamentos (PIX + Cartão) |

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool ultra-rápido |
| **Tailwind CSS** | Estilização utility-first |
| **Framer Motion** | Animações fluidas |
| **React Router v6** | Roteamento SPA |
| **Axios** | HTTP client |
| **Lucide React** | Ícones modernos |

---

## 🏗 Arquitetura

O projeto utiliza **Arquitetura Hexagonal (Ports & Adapters)** no backend:

```
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLERS                             │
│              (Entrada HTTP - NestJS)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                      SERVICES                                │
│           (Lógica de Negócio - Use Cases)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   PORTS (Interfaces)                         │
│        (Contratos - Inversão de Dependência)                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│               ADAPTERS (Implementations)                     │
│             (Repositórios - Acesso a Dados)                 │
└─────────────────────────────────────────────────────────────┘
```

### Benefícios
- ✅ Testabilidade (mocks fáceis via interfaces)
- ✅ Baixo acoplamento
- ✅ Troca de infraestrutura sem impacto na lógica

---

## ✨ Funcionalidades

### Implementado ✅

| Módulo | Funcionalidades |
|--------|----------------|
| **Auth** | Login JWT, Guards por role, Refresh token |
| **Usuário** | CRUD completo, Soft delete, Validação CPF |
| **Professor** | CRUD, Lista com treinos criados |
| **Exercício** | CRUD por professores |
| **Treino** | CRUD, Catálogo público, Associação de exercícios |
| **Pagamento** | PIX com QR Code, Cartão de crédito, Webhooks Asaas |
| **Frontend** | Dashboard por role, Compra de treinos, Profile editing |

### Em Desenvolvimento 🚧

- [ ] Microserviço de desativação automática
- [ ] API de relatórios
- [ ] Notificações por email
- [ ] Paginação avançada com filtros

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+
- Docker (opcional)

### 1. Clonar repositório
```bash
git clone <repo-url>
cd projeto
```

### 2. Configurar banco de dados
```bash
# Criar banco
psql -U postgres -c "CREATE DATABASE acad_db;"

# Executar schema
psql -U postgres -d acad_db -f database_schema.sql
```

### 3. Configurar variáveis de ambiente

**Backend (`backend/env/.env`):**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acad_db
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
DB_POOL_MAX=20

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa

# Asaas (usar sandbox para testes)
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=secret_para_webhooks

# Server
NODE_ENV=development
PORT=3000
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar serviços

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

| Serviço | URL |
|---------|-----|
| Backend | http://localhost:3000 |
| Frontend | http://localhost:5173 |

### Docker (Alternativo)
```bash
docker-compose up -d
```

---

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   └── src/
│       ├── common/              # Shared utilities
│       │   ├── decorators/      # @Roles, @User, @Public
│       │   ├── enum/            # Role enum
│       │   ├── guards/          # JwtAuthGuard, RoleGuard
│       │   └── pagination/      # Pagination DTO
│       ├── config/              # Database config
│       └── modules/
│           ├── auth/            # Authentication
│           ├── database/        # DB connection
│           ├── exercicio/       # Exercise CRUD
│           ├── pagamento/       # Payments (Asaas)
│           ├── professor/       # Professor CRUD
│           ├── treino/          # Training CRUD
│           └── usuario/         # User CRUD
│
├── frontend/
│   └── src/
│       ├── components/          # Navbar, UI components
│       ├── lib/                 # API client, utilities
│       ├── pages/               # Route pages
│       └── services/            # API service layer
│
├── database_schema.sql          # Database DDL
├── docker-compose.yml           # Docker orchestration
└── README.md
```

---

## 📡 API Endpoints

### Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/login` | Login | ❌ |

### Usuários
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/usuario/register` | Auto-registro | ❌ |
| POST | `/usuario` | Criar usuário | ADM |
| GET | `/usuario` | Listar usuários | ADM |
| PUT | `/usuario/update/:id` | Atualizar | ADM, ALUNO |
| DELETE | `/usuario/delete/:id` | Soft delete | ADM, ALUNO |
| POST | `/usuario/:id/customer-asaas` | Criar customer Asaas | ALL |

### Professores
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/professor` | Criar professor | ADM |
| GET | `/professor` | Listar (com treinos) | ADM |
| PUT | `/professor/update/:id` | Atualizar | ADM, PROFESSOR |
| DELETE | `/professor/delete/:id` | Soft delete | ADM |

### Exercícios
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/exercicio` | Criar exercício | PROFESSOR |
| GET | `/exercicio` | Listar exercícios | PROFESSOR |
| PUT | `/exercicio/update/:id` | Atualizar | PROFESSOR |
| DELETE | `/exercicio/delete/:id` | Soft delete | PROFESSOR |

### Treinos
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/treino` | Criar treino | PROFESSOR |
| GET | `/treino` | Listar treinos | PROFESSOR, ADM |
| GET | `/treino/catalogo` | Catálogo público | ALL |
| PUT | `/treino/update/:id` | Atualizar | PROFESSOR |
| DELETE | `/treino/delete/:id` | Soft delete | PROFESSOR |

### Pagamentos
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/pagamento/compra` | Comprar treino | ALUNO |
| POST | `/pagamento/webhook` | Webhook Asaas | - |
| GET | `/pagamento/:id/status` | Status pagamento | ALUNO |

---

## 👥 Papéis e Permissões

| Papel | Descrição | Permissões |
|-------|-----------|------------|
| **ADM** | Administrador | Acesso total, CRUD usuários/professores |
| **PROFESSOR** | Treinador | CRUD exercícios/treinos próprios |
| **ALUNO** | Estudante | Ver catálogo, comprar treinos, editar perfil |

---

## 🎨 Design System

O frontend utiliza **Neo-Brutalism** com:

- **Fonts**: Archivo Black (headings), Space Grotesk (body)
- **Colors**: Yellow (#FDE047), Blue (#3B82F6), Black (#000)
- **Shadows**: Hard shadows com offset sólido
- **Borders**: Bordas grossas (3-4px) em preto
- **Animations**: Framer Motion para transições

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test              # Rodar testes
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

---

## 📦 Scripts Disponíveis

### Backend
| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | Desenvolvimento com hot-reload |
| `npm run build` | Build de produção |
| `npm test` | Executar testes |
| `npm run lint` | Verificar código |

### Frontend
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

**Anderson Freires de Freitas**  
📧 andffreires@gmail.com

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Versão**: 2.0.0  
**Última Atualização**: Dezembro 2025
