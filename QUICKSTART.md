# 🚀 Guia Rápido de Inicialização

Siga este guia para ter o projeto rodando em **menos de 5 minutos**.

---

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ (rodando)
- NPM ou Yarn

---

## 1️⃣ Configurar Banco de Dados

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE acad_db;"

# Executar schema (na raiz do projeto)
psql -U postgres -d acad_db -f database_schema.sql
```

---

## 2️⃣ Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente
mkdir -p env
cat > env/.env << 'EOF'
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acad_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# JWT
JWT_SECRET=minha_chave_jwt_super_secreta_2025

# Asaas (sandbox para testes)
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_API_KEY=sua_chave_asaas
ASAAS_WEBHOOK_SECRET=webhook_secret_123

# Server
NODE_ENV=development
PORT=3000
EOF

# Iniciar backend
npm run start:dev
```

Backend rodando em: **http://localhost:3000**

---

## 3️⃣ Configurar Frontend

Em **outro terminal**:

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar frontend
npm run dev
```

Frontend rodando em: **http://localhost:5173**

---

## 4️⃣ Criar Usuário Admin

O banco já vem com um admin básico do schema, mas você pode criar um novo via API:

```bash
curl -X POST http://localhost:3000/usuario/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin",
    "email": "admin@teste.com",
    "senha": "123456",
    "cpf": "12345678909"
  }'
```

---

## 5️⃣ Acessar o Sistema

1. Abra **http://localhost:5173**
2. Clique em **"Entrar"**
3. Use as credenciais:
   - Email: `admin@teste.com`
   - Senha: `123456`

---

## 🎮 Testando Funcionalidades

### Como ALUNO
1. Registre uma nova conta em "Cadastrar"
2. Faça login
3. Acesse "Catálogo" para ver treinos
4. Compre um treino (PIX ou Cartão)

### Como PROFESSOR
1. Crie um professor via painel ADM
2. Faça login como professor
3. Crie exercícios em "Exercícios"
4. Crie treinos em "Meus Treinos"

### Como ADM
1. Acesse "Gerenciar Usuários"
2. Acesse "Gerenciar Professores"
3. Visualize treinos e exercícios

---

## 💳 Testar Pagamentos (Sandbox)

Para testar cartão de crédito no Asaas sandbox:

```
Número: 5162306219378829
Validade: qualquer data futura
CVV: 123
Nome: Teste da Silva
CPF: 12345678909
```

---

## 🔧 Comandos Úteis

```bash
# Backend
npm run start:dev    # Desenvolvimento
npm run build        # Build produção
npm test             # Testes

# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview do build
```

---

## ❓ Solução de Problemas

### "Connection refused" no banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql
# ou
brew services list | grep postgres
```

### "Cannot find module" no backend
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend não conecta ao backend
```bash
# Verificar se o backend está rodando
curl http://localhost:3000

# Verificar .env do frontend
cat frontend/.env
# Deve conter: VITE_API_URL=http://localhost:3000
```

### Erro de autenticação
```bash
# Limpar localStorage do navegador
# Abra o console (F12) e execute:
localStorage.clear()
```

---

## 📁 Estrutura de Pastas

```
projeto/
├── backend/           # API NestJS
│   ├── env/.env       # Variáveis de ambiente
│   └── src/           # Código fonte
├── frontend/          # React + Vite
│   ├── .env           # VITE_API_URL
│   └── src/           # Código fonte
├── database_schema.sql # Schema do banco
└── docker-compose.yml  # Docker (opcional)
```

---

## 🐳 Docker (Alternativo)

Se preferir usar Docker:

```bash
# Na raiz do projeto
docker-compose up -d

# Acessar
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# PostgreSQL: localhost:5432
```

---

**Pronto!** 🎉 O sistema está rodando. Explore as funcionalidades!

Para documentação completa, veja o [README.md](./README.md).
