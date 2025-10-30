# Guia Rápido de Inicialização

Este guia mostra como rodar o projeto completo (backend + frontend) e testar as funcionalidades principais.

## 1. Pré-requisitos

- Node.js 20+
- PostgreSQL rodando
- NPM ou Yarn

## 2. Configuração do Banco de Dados

```bash
# Acessar PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE acad_db;

# Executar o schema
\i database_schema.sql
```

## 3. Configurar Variáveis de Ambiente

Crie o arquivo `env/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acad_db
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_SSL=false
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# JWT
JWT_SECRET=4f73b3a3b0f6e4d0b8b4a2d9f1e6c7a5d4b2c1e0f9a8b7c6d5e4f3a2b1c0d9e8

# Asaas Payment Gateway (usar sandbox para testes)
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_API_KEY=sua_chave_api_asaas
ASAAS_WEBHOOK_SECRET=4f73b3a3b0f6e4d0b8b4a2d9f1e6c7a5d4b2c1e0f9a8b7c6d5e4f3a2b1c0d9e8

# Server
NODE_ENV=development
PORT=3000
```

## 4. Iniciar o Backend

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run start:dev
```

Backend estará rodando em `http://localhost:3000`

## 5. Iniciar o Frontend

Em outro terminal:

```bash
# Acessar pasta do frontend
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Rodar em desenvolvimento
npm run dev
```

Frontend estará rodando em `http://localhost:5173`

## 6. Criar Usuários de Teste

Use o endpoint `POST /usuario` para criar usuários de teste. Você pode usar ferramentas como Postman, Insomnia, ou curl:

### Criar Admin (necessário fazer via API primeiro)

```bash
curl -X POST http://localhost:3000/usuario \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin Teste",
    "email": "admin@teste.com",
    "senha": "admin123",
    "tipo": "ADM"
  }'
```

### Logar como Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "senha": "admin123"
  }'
```

Isso retornará um `access_token` que você pode usar para autenticar.

### Criar outros usuários via Frontend

1. Faça login como Admin no frontend (`http://localhost:5173`)
2. Acesse "Usuários" no menu
3. Crie novos usuários (Professores e Alunos)

## 7. Testar Fluxo Completo

### Como Professor:

1. Login com usuário do tipo PROFESSOR
2. Ir em "Exercícios" → Criar alguns exercícios
3. Ir em "Meus Treinos" → Criar um treino com exercícios
4. Definir um preço para o treino

### Como Aluno:

1. Login com usuário do tipo ALUNO
2. Ir em "Catálogo" → Ver treinos disponíveis
3. Clicar em "Comprar" em um treino
4. Escolher método de pagamento:
   - **PIX**: Será gerado um QR Code (no sandbox, o pagamento não é processado automaticamente)
   - **Cartão**: Preencher dados do cartão (use dados de teste do Asaas)

### Como Admin:

1. Login com usuário do tipo ADM
2. Acessar todas as funcionalidades
3. Gerenciar usuários, professores, visualizar treinos

## 8. Testes com Asaas Sandbox

Para testar pagamentos com cartão no sandbox do Asaas:

```
Número do Cartão: 5162306219378829
CVV: qualquer
Validade: qualquer data futura
Nome: qualquer nome
CPF: qualquer CPF válido (ex: 123.456.789-09)
```

## 9. Estrutura de Papéis

### ADM
- Acesso total ao sistema
- CRUD de usuários
- CRUD de professores
- Visualização de todos os treinos

### PROFESSOR
- CRUD de exercícios
- CRUD de treinos (apenas os próprios)
- Não pode comprar treinos

### ALUNO
- Ver catálogo de treinos
- Comprar treinos (PIX ou Cartão)
- Acessar treinos comprados
- Editar perfil próprio

## 10. Solução de Problemas

### Backend não conecta ao banco
- Verifique se PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Certifique-se de que o banco `acad_db` foi criado

### Frontend não conecta ao backend
- Verifique se o backend está rodando em `http://localhost:3000`
- Confirme o `VITE_API_URL` no `.env` do frontend
- Limpe o cache do navegador e localStorage

### Erro de autenticação
- Limpe o localStorage do navegador
- Faça login novamente
- Verifique se o `JWT_SECRET` está configurado

### Webhook não funciona
- Webhooks do Asaas exigem URL pública (use ngrok para testes locais)
- Configure a URL do webhook no painel do Asaas
- Verifique o `ASAAS_WEBHOOK_SECRET` no `.env`

## 11. Próximos Passos

- Explorar as funcionalidades de cada papel
- Testar compra de treinos
- Verificar integração de pagamentos
- Contribuir com melhorias!

---

**Dica**: Para desenvolvimento local sem webhook real, você pode usar ngrok ou similar para expor o backend:

```bash
ngrok http 3000
```

E configurar a URL gerada no painel do Asaas.

