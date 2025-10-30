#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

BASE_URL="http://localhost:3000"
ADM_TOKEN=""
PROF_TOKEN=""
ALUNO_TOKEN=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   TESTANDO API DA ACADEMIA - COMPLETO${NC}"
echo -e "${BLUE}========================================${NC}\n"

# ============================================
# PARTE 1: TESTES COMO ADMINISTRADOR
# ============================================
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   PARTE 1: ROTAS DE ADMINISTRADOR${NC}"
echo -e "${CYAN}========================================${NC}\n"

# 1. Login como ADM
echo -e "${YELLOW}[1] POST /auth/login (ADM)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "andffreires@gmail.com",
    "senha": "1234"
  }')
echo "$RESPONSE" | jq '.'
ADM_TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
if [ "$ADM_TOKEN" != "null" ] && [ "$ADM_TOKEN" != "" ]; then
  echo -e "${GREEN}✓ Login ADM bem-sucedido${NC}\n"
else
  echo -e "${RED}✗ Falha no login ADM${NC}\n"
  exit 1
fi

# 2. Listar alunos
echo -e "${YELLOW}[2] GET /usuario?page=1&size=10 (listar alunos)${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/usuario?page=1&size=10" \
  -H "Authorization: Bearer $ADM_TOKEN")
echo "$RESPONSE" | jq '.'
TOTAL_ALUNOS=$(echo "$RESPONSE" | jq -r '.Total')
echo -e "${GREEN}✓ Total de alunos: $TOTAL_ALUNOS${NC}\n"

# 3. Listar professores
echo -e "${YELLOW}[3] GET /professor?page=1&size=10 (listar professores)${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/professor?page=1&size=10" \
  -H "Authorization: Bearer $ADM_TOKEN")
echo "$RESPONSE" | jq '.'
TOTAL_PROFS=$(echo "$RESPONSE" | jq -r '.Total')
echo -e "${GREEN}✓ Total de professores: $TOTAL_PROFS${NC}\n"

# 4. Criar novo aluno (com CPF válido)
echo -e "${YELLOW}[4] POST /usuario (criar aluno com CPF válido)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/usuario" \
  -H "Authorization: Bearer $ADM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Aluno Teste Curl",
    "email": "aluno.curl.'$(date +%s)'@gmail.com",
    "senha": "senha123",
    "cpf": "12345678909",
    "tipo": "ALUNO"
  }')
echo "$RESPONSE" | jq '.'
NOVO_ALUNO_ID=$(echo "$RESPONSE" | jq -r '.id_usuario // .ID')
if [ "$NOVO_ALUNO_ID" != "null" ] && [ "$NOVO_ALUNO_ID" != "" ]; then
  echo -e "${GREEN}✓ Aluno criado (ID: $NOVO_ALUNO_ID)${NC}\n"
else
  echo -e "${RED}⚠ Falha ao criar aluno${NC}\n"
fi

# 5. Criar novo professor (com CPF válido)
echo -e "${YELLOW}[5] POST /professor (criar professor com CPF válido)${NC}"
PROF_EMAIL="prof.curl.$(date +%s)@gmail.com"
RESPONSE=$(curl -s -X POST "$BASE_URL/professor" \
  -H "Authorization: Bearer $ADM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Professor Teste Curl\",
    \"email\": \"$PROF_EMAIL\",
    \"senha\": \"senha123\",
    \"cpf\": \"98765432100\",
    \"especialidade\": \"Musculação\"
  }")
echo "$RESPONSE" | jq '.'
NOVO_PROF_ID=$(echo "$RESPONSE" | jq -r '.id_professor // .ID')
if [ "$NOVO_PROF_ID" != "null" ] && [ "$NOVO_PROF_ID" != "" ]; then
  echo -e "${GREEN}✓ Professor criado (ID: $NOVO_PROF_ID)${NC}\n"
else
  echo -e "${RED}⚠ Falha ao criar professor${NC}\n"
fi

# ============================================
# PARTE 2: TESTES COMO PROFESSOR
# ============================================
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   PARTE 2: ROTAS DE PROFESSOR${NC}"
echo -e "${CYAN}========================================${NC}\n"

# 6. Login como Professor (usando existente)
echo -e "${YELLOW}[6] POST /auth/login (Professor existente)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof.teste@test.com",
    "senha": "senha123"
  }')
echo "$RESPONSE" | jq '.'
PROF_TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
if [ "$PROF_TOKEN" != "null" ] && [ "$PROF_TOKEN" != "" ]; then
  echo -e "${GREEN}✓ Login Professor bem-sucedido${NC}\n"
else
  echo -e "${RED}⚠ Professor não encontrado, tentando outro...${NC}\n"
  # Tentar com professor recém-criado
  if [ "$NOVO_PROF_ID" != "null" ] && [ "$NOVO_PROF_ID" != "" ]; then
    RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$PROF_EMAIL\",
        \"senha\": \"senha123\"
      }")
    PROF_TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
  fi
fi

if [ "$PROF_TOKEN" != "null" ] && [ "$PROF_TOKEN" != "" ]; then
  # 7. Criar exercício
  echo -e "${YELLOW}[7] POST /exercicio (criar exercício)${NC}"
  RESPONSE=$(curl -s -X POST "$BASE_URL/exercicio" \
    -H "Authorization: Bearer $PROF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "nome": "Supino Reto",
      "descricao": "Exercício de peito com barra"
    }')
  echo "$RESPONSE" | jq '.'
  EXERCICIO_ID=$(echo "$RESPONSE" | jq -r '.id // .ID')
  echo -e "${GREEN}✓ Exercício criado (ID: $EXERCICIO_ID)${NC}\n"

  # 8. Listar exercícios
  echo -e "${YELLOW}[8] GET /exercicio?page=1&size=10 (listar exercícios)${NC}"
  RESPONSE=$(curl -s -X GET "$BASE_URL/exercicio?page=1&size=10" \
    -H "Authorization: Bearer $PROF_TOKEN")
  echo "$RESPONSE" | jq '.'
  echo -e "${GREEN}✓ Listagem de exercícios${NC}\n"

  # 9. Atualizar exercício
  if [ "$EXERCICIO_ID" != "null" ] && [ "$EXERCICIO_ID" != "" ]; then
    echo -e "${YELLOW}[9] PUT /exercicio/update/$EXERCICIO_ID${NC}"
    curl -s -X PUT "$BASE_URL/exercicio/update/$EXERCICIO_ID" \
      -H "Authorization: Bearer $PROF_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "nome": "Supino Reto ATUALIZADO",
        "descricao": "Descrição atualizada"
      }' | jq '.'
    echo -e "${GREEN}✓ Exercício atualizado${NC}\n"
  fi

  # 10. Criar treino
  if [ "$EXERCICIO_ID" != "null" ] && [ "$EXERCICIO_ID" != "" ]; then
    echo -e "${YELLOW}[10] POST /treino (criar treino)${NC}"
    RESPONSE=$(curl -s -X POST "$BASE_URL/treino" \
      -H "Authorization: Bearer $PROF_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"titulo\": \"Treino Full Body\",
        \"descricao\": \"Treino completo\",
        \"preco\": 99.90,
        \"exercicios\": [
          {
            \"id_exercicio\": $EXERCICIO_ID,
            \"ordem\": 1,
            \"series\": 3,
            \"repeticoes\": 12,
            \"carga\": 60,
            \"observacoes\": \"Manter postura\"
          }
        ]
      }")
    echo "$RESPONSE" | jq '.'
    TREINO_ID=$(echo "$RESPONSE" | jq -r '.id // .ID')
    echo -e "${GREEN}✓ Treino criado (ID: $TREINO_ID)${NC}\n"
  fi

  # 11. Listar treinos do professor
  echo -e "${YELLOW}[11] GET /treino?page=1&size=10 (listar meus treinos)${NC}"
  curl -s -X GET "$BASE_URL/treino?page=1&size=10" \
    -H "Authorization: Bearer $PROF_TOKEN" | jq '.'
  echo -e "${GREEN}✓ Listagem de treinos do professor${NC}\n"

  # 12. Atualizar treino
  if [ "$TREINO_ID" != "null" ] && [ "$TREINO_ID" != "" ]; then
    echo -e "${YELLOW}[12] PUT /treino/update/$TREINO_ID${NC}"
    curl -s -X PUT "$BASE_URL/treino/update/$TREINO_ID" \
      -H "Authorization: Bearer $PROF_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "titulo": "Treino Full Body ATUALIZADO",
        "preco": 149.90
      }' | jq '.'
    echo -e "${GREEN}✓ Treino atualizado${NC}\n"
  fi
else
  echo -e "${RED}✗ Não foi possível fazer login como professor. Pulando testes de professor.${NC}\n"
fi

# ============================================
# PARTE 3: TESTES COMO ALUNO
# ============================================
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   PARTE 3: ROTAS DE ALUNO${NC}"
echo -e "${CYAN}========================================${NC}\n"

# 13. Login como Aluno
echo -e "${YELLOW}[13] POST /auth/login (Aluno)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "isadorasamia@gmail.com",
    "senha": "senha123"
  }')
echo "$RESPONSE" | jq '.'
ALUNO_TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
if [ "$ALUNO_TOKEN" != "null" ] && [ "$ALUNO_TOKEN" != "" ]; then
  echo -e "${GREEN}✓ Login Aluno bem-sucedido${NC}\n"
else
  echo -e "${RED}⚠ Aluno não encontrado${NC}\n"
fi

if [ "$ALUNO_TOKEN" != "null" ] && [ "$ALUNO_TOKEN" != "" ]; then
  # 14. Ver catálogo de treinos
  echo -e "${YELLOW}[14] GET /treino/catalogo?page=1&size=10${NC}"
  RESPONSE=$(curl -s -X GET "$BASE_URL/treino/catalogo?page=1&size=10" \
    -H "Authorization: Bearer $ALUNO_TOKEN")
  echo "$RESPONSE" | jq '.'
  TOTAL_TREINOS=$(echo "$RESPONSE" | jq -r '.Total')
  echo -e "${GREEN}✓ Catálogo com $TOTAL_TREINOS treinos${NC}\n"
fi

# ============================================
# LIMPEZA (OPCIONAL)
# ============================================
if [ "$1" == "--cleanup" ]; then
  echo -e "${CYAN}========================================${NC}"
  echo -e "${CYAN}   LIMPEZA - DELETANDO RECURSOS CRIADOS${NC}"
  echo -e "${CYAN}========================================${NC}\n"

  if [ "$PROF_TOKEN" != "null" ] && [ "$PROF_TOKEN" != "" ]; then
    if [ "$EXERCICIO_ID" != "null" ] && [ "$EXERCICIO_ID" != "" ]; then
      echo -e "${YELLOW}DELETE /exercicio/delete/$EXERCICIO_ID${NC}"
      curl -s -X DELETE "$BASE_URL/exercicio/delete/$EXERCICIO_ID" \
        -H "Authorization: Bearer $PROF_TOKEN" | jq '.'
      echo -e "${GREEN}✓ Exercício deletado${NC}\n"
    fi

    if [ "$TREINO_ID" != "null" ] && [ "$TREINO_ID" != "" ]; then
      echo -e "${YELLOW}DELETE /treino/delete/$TREINO_ID${NC}"
      curl -s -X DELETE "$BASE_URL/treino/delete/$TREINO_ID" \
        -H "Authorization: Bearer $PROF_TOKEN" | jq '.'
      echo -e "${GREEN}✓ Treino deletado${NC}\n"
    fi
  fi

  if [ "$NOVO_PROF_ID" != "null" ] && [ "$NOVO_PROF_ID" != "" ]; then
    echo -e "${YELLOW}DELETE /professor/delete/$NOVO_PROF_ID${NC}"
    curl -s -X DELETE "$BASE_URL/professor/delete/$NOVO_PROF_ID" \
      -H "Authorization: Bearer $ADM_TOKEN" | jq '.'
    echo -e "${GREEN}✓ Professor deletado${NC}\n"
  fi

  if [ "$NOVO_ALUNO_ID" != "null" ] && [ "$NOVO_ALUNO_ID" != "" ]; then
    echo -e "${YELLOW}DELETE /usuario/delete/$NOVO_ALUNO_ID${NC}"
    curl -s -X DELETE "$BASE_URL/usuario/delete/$NOVO_ALUNO_ID" \
      -H "Authorization: Bearer $ADM_TOKEN" | jq '.'
    echo -e "${GREEN}✓ Aluno deletado${NC}\n"
  fi
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   TODOS OS TESTES CONCLUÍDOS!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${YELLOW}Dica: Execute com --cleanup para deletar recursos criados${NC}"
echo -e "${YELLOW}Exemplo: ./test-api-complete.sh --cleanup${NC}\n"

