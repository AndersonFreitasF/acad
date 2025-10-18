# Sistema de Gestão de Treinos

Este projeto é um sistema de gestão de treinos que permite o cadastro de usuários (administradores, professores e alunos), criação e gerenciamento de treinos, registro de exercícios e controle de pagamentos. O objetivo é facilitar a organização de treinos entre professores e alunos, além de manter o histórico de pagamentos e assinaturas.

## Tecnologias Utilizadas

- **Backend**: NestJS (Node.js)
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Hash de Senhas**: Argon2
- **Validação**: Class Validator
- **Testes**: Vitest
- **Containerização**: Docker & Docker Compose
- **Linguagem**: TypeScript

## Arquitetura

O projeto utiliza a **Arquitetura Hexagonal (Ports & Adapters)**, que separa a lógica de negócio da infraestrutura, facilitando a manutenção e testes.

### Estrutura de Pastas

```
src/
├── common/                 # Componentes compartilhados
│   ├── decorators/        # Decorators customizados
│   ├── enum/             # Enums do sistema
│   ├── guards/           # Guards de autenticação/autorização
│   └── pagination/       # DTOs de paginação
├── config/               # Configurações do sistema
├── modules/              # Módulos da aplicação
│   ├── auth/            # Autenticação
│   ├── usuario/         # Gestão de usuários
│   ├── professor/       # Gestão de professores
│   ├── exercicio/       # Gestão de exercícios
│   ├── treino/          # Gestão de treinos (planejado)
│   └── database/        # Conexão com banco de dados
└── main.ts              # Ponto de entrada da aplicação
```

### Fluxo de Autenticação

1. Usuário faz login via `POST /auth/login`
2. Sistema valida credenciais e retorna JWT
3. Token JWT é usado para autenticar requisições subsequentes
4. Guards verificam permissões baseadas no role do usuário

## Módulos Implementados

### Auth Module
- **Funcionalidade**: Autenticação e autorização
- **Endpoints**:
  - `POST /auth/login` - Login de usuários
- **Tecnologias**: JWT, Argon2 para hash de senhas
- **Guards**: JwtAuthGuard para proteção de rotas

### Usuario Module
- **Funcionalidade**: Gestão completa de usuários
- **Endpoints**:
  - `POST /usuario` - Criar usuário (ADM)
  - `GET /usuario` - Listar usuários (ADM)
  - `PUT /usuario/update/:id` - Atualizar usuário (ALUNO/ADM)
  - `DELETE /usuario/delete/:id` - Deletar usuário (ADM/ALUNO)
- **Roles**: ADM, ALUNO, PROFESSOR
- **Campos**: nome, email, senha, tipo, perfilAtivo

### Professor Module
- **Funcionalidade**: Gestão específica de professores
- **Endpoints**:
  - `POST /professor` - Criar professor (ADM)
  - `GET /professor` - Listar professores (ADM)
  - `PUT /professor/update/:id` - Atualizar professor (ADM/PROFESSOR)
  - `DELETE /professor/delete/:id` - Deletar professor (ADM)
- **Permissões**: Apenas ADM pode criar/deletar professores

### Exercicio Module
- **Funcionalidade**: Cadastro e gerenciamento de exercícios
- **Endpoints**:
  - `POST /exercicio` - Criar exercício (PROFESSOR)
  - `GET /exercicio` - Listar exercícios (PROFESSOR)
  - `PUT /exercicio/update/:id` - Atualizar exercício (PROFESSOR)
  - `DELETE /exercicio/delete/:id` - Deletar exercício (PROFESSOR)
- **Campos**: nome, descrição

### Database Module
- **Funcionalidade**: Conexão e operações com PostgreSQL
- **Features**: Pool de conexões, health check, operações CRUD genéricas

## Módulos Planejados (A Implementar)

### Treino Module
- **Funcionalidade**: Criação e gerenciamento de treinos para alunos
- **Endpoints Planejados**:
  - `POST /treino` - Criar treino (PROFESSOR)
  - `GET /treino` - Listar treinos (PROFESSOR/ALUNO)
  - `PUT /treino/update/:id` - Atualizar treino (PROFESSOR)
  - `DELETE /treino/delete/:id` - Deletar treino (PROFESSOR)
- **Funcionalidades**:
  - Associação de exercícios aos treinos
  - Agendamento de treinos
  - Histórico de treinos por aluno

### Pagamento Module
- **Funcionalidade**: Integração com API externa para processamento de pagamentos
- **Endpoints Planejados**:
  - `POST /pagamento` - Processar pagamento
  - `GET /pagamento/historico` - Histórico de pagamentos
  - `PUT /pagamento/status/:id` - Atualizar status do pagamento
- **Funcionalidades**:
  - Integração com gateway de pagamento externo
  - Controle de assinaturas mensais
  - Histórico financeiro
  - Notificações de pagamento

### Microserviço de Desativação
- **Funcionalidade**: Serviço automatizado para desativar perfis inativos
- **Características**:
  - Análise de tempo de inatividade dos usuários
  - Desativação automática de perfis inativos
  - Notificações antes da desativação
  - Possibilidade de reativação manual
- **Tecnologia**: Microserviço separado (provavelmente Node.js/NestJS)

## Roles e Permissões

### ADM (Administrador)
- **Acesso**: Completo ao sistema
- **Permissões**:
  - Criar, listar, atualizar e deletar usuários
  - Gerenciar professores
  - Acesso a relatórios e métricas

### PROFESSOR
- **Acesso**: Gerenciamento de exercícios e treinos
- **Permissões**:
  - Criar, editar e deletar exercícios
  - Criar e gerenciar treinos para alunos
  - Visualizar alunos associados

### ALUNO
- **Acesso**: Visualização de treinos e exercícios
- **Permissões**:
  - Visualizar treinos atribuídos
  - Atualizar perfil próprio
  - Acessar histórico de treinos

## Configuração e Execução

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Docker (opcional)

### Variáveis de Ambiente
Crie um arquivo `.env` na pasta `env/`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acad_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
NODE_ENV=development
PORT=3000
```

### Instalação e Execução

#### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run start:dev

# Executar testes
npm test

# Executar testes com cobertura
npm run test:cov
```

#### Produção com Docker
```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run

# Ou usar Docker Compose
docker-compose up
```

### Scripts Disponíveis
- `npm run build` - Build da aplicação
- `npm run start` - Iniciar aplicação
- `npm run start:dev` - Iniciar em modo desenvolvimento
- `npm run start:debug` - Iniciar em modo debug
- `npm run start:prod` - Iniciar em produção
- `npm run test` - Executar testes
- `npm run test:watch` - Executar testes em modo watch
- `npm run lint` - Executar linter
- `npm run format` - Formatar código

## Testes

O projeto utiliza **Vitest** para testes unitários com cobertura de código.

### Executar Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov

# Testes em modo debug
npm run test:debug
```

### Estrutura de Testes
```
src/modules/[module]/tests/
├── [service].service.spec.ts
└── [repository].repository.spec.ts
```

## Status do Projeto

### Implementado
- [x] Autenticação e autorização
- [x] Gestão de usuários
- [x] Gestão de professores
- [x] Gestão de exercícios
- [x] Configuração de banco de dados
- [x] Testes unitários
- [x] Dockerização

### Em Desenvolvimento
- [ ] Módulo de treinos
- [ ] Módulo de pagamentos
- [ ] Microserviço de desativação

### Planejado
- [ ] API de relatórios
- [ ] Notificações por email
- [ ] Dashboard administrativo
- [ ] API de métricas

## API Endpoints

### Autenticação
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/auth/login` | Login de usuário | Todos |

### Usuários
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/usuario` | Criar usuário | ADM |
| GET | `/usuario` | Listar usuários | ADM |
| PUT | `/usuario/update/:id` | Atualizar usuário | ALUNO, ADM |
| DELETE | `/usuario/delete/:id` | Deletar usuário | ADM, ALUNO |

### Professores
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/professor` | Criar professor | ADM |
| GET | `/professor` | Listar professores | ADM |
| PUT | `/professor/update/:id` | Atualizar professor | ADM, PROFESSOR |
| DELETE | `/professor/delete/:id` | Deletar professor | ADM |

### Exercícios
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| POST | `/exercicio` | Criar exercício | PROFESSOR |
| GET | `/exercicio` | Listar exercícios | PROFESSOR |
| PUT | `/exercicio/update/:id` | Atualizar exercício | PROFESSOR |
| DELETE | `/exercicio/delete/:id` | Deletar exercício | PROFESSOR |

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **Email**: [seu.email@exemplo.com]

---

**Versão**: 1.0.0  
**Última Atualização**: 2024