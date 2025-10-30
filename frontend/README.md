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

🚧 **Próximos passos** (conforme plano em `/compra.plan.md`):
1. Criar componentes UI base em `src/components/ui/`:
   - Button.tsx
   - Input.tsx
   - Card.tsx
   - Modal.tsx
   - Table.tsx
2. Criar layout em `src/components/layout/`:
   - Sidebar.tsx
   - Topbar.tsx
   - BottomNav.tsx
   - Layout.tsx
3. Implementar login em `src/pages/auth/LoginPage.tsx`
4. Criar PrivateRoute e routing com React Router
5. Páginas Aluno (catálogo, compra, meus treinos)
6. Páginas Professor (CRUD exercícios/treinos)
7. Páginas Admin (CRUD usuários/professores)

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
