# Frontend - Academia

Frontend React + TypeScript + Tailwind CSS + Vite

## Setup completo

```bash
cd frontend
npm install
```

Criar arquivo `.env` na raiz do frontend:
```env
VITE_API_URL=http://localhost:3000
```

## Executar

```bash
npm run dev
```

## Status de implementação

✅ **Concluído:**
- Scaffold Vite + React + TypeScript
- Tailwind CSS configurado
- Dependências instaladas (react-router-dom, axios, zustand, react-hook-form, zod, lucide-react)
- API client com interceptor JWT (`src/api/client.ts`)
- Types TypeScript (`src/types/index.ts`)
- Auth store Zustand (`src/store/authStore.ts`)
- Componentes UI base (Button, Input, Card, Modal, Table)
- Layout responsivo (Sidebar, Topbar)
- Sistema de autenticação (Login, PrivateRoute)
- **Páginas Aluno:**
  - Dashboard
  - Catálogo de treinos
  - Modal de compra (PIX com QR Code + Cartão de Crédito)
- **Páginas Professor:**
  - Dashboard
  - CRUD de Exercícios
  - CRUD de Treinos (listagem/deleção)
- **Páginas Admin:**
  - Dashboard
  - CRUD de Usuários

🚧 **Melhorias futuras:**
- Meus Treinos para Aluno
- Formulário completo de criação/edição de Treinos (Professor)
- CRUD de Professores (Admin)
- Paginação e filtros
- Loading states melhorados
- Toast notifications
- Responsividade mobile (BottomNav)

## Estrutura de pastas
```
src/
├── api/              # Axios client
├── components/
│   ├── ui/           # Componentes reutilizáveis
│   └── layout/       # Layout/navegação
├── pages/            # Páginas por papel
│   ├── auth/
│   ├── aluno/
│   ├── professor/
│   └── admin/
├── hooks/            # Custom hooks
├── store/            # Zustand stores
├── types/            # TypeScript types
└── utils/            # Helpers
```

## Design system

- Tema: moderno/minimalista
- Fundo: #f9fafb (gray-50)
- Primária: #3b82f6 (blue-500)
- Cards: bg-white, shadow-sm, rounded-lg
- Desktop: Sidebar fixa + topbar
- Mobile: Bottom nav + hamburguer

## Endpoints backend

- POST `/auth/login` - Login
- GET `/treino/catalogo` - Catálogo (aluno)
- POST `/pagamento/compra` - Comprar treino
- GET `/treino` - Treinos (filtrado por professor)
- GET `/exercicio` - Exercícios
- GET `/usuario` - Usuários (admin)
- GET `/professor` - Professores (admin)

Ver plano completo: `/compra.plan.md`
