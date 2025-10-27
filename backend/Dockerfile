# ---- build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# instala dependências de build
COPY package*.json ./
RUN npm ci

# copia código e compila
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# cria usuário não-root (opcional, recomendado)
RUN addgroup -S app && adduser -S app -G app

# copia apenas o necessário do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
