#!/bin/bash

# Script para migrar imagens locais para o Railway
# Executa login, obtém cookie de sessão, e faz upload de cada imagem

RAILWAY_URL="https://anpereao-production.up.railway.app"
LOCAL_UPLOADS="./uploads"
ADMIN_USER="admin"
ADMIN_PASS="admin123"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Iniciando migração de imagens para Railway..."

# Login e obter cookie de sessão
echo "🔐 Fazendo login..."
COOKIE_FILE="/tmp/railway_session.txt"

LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$RAILWAY_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo -e "${GREEN}✅ Login bem-sucedido!${NC}"
else
  echo -e "${RED}❌ Falha no login: $LOGIN_RESPONSE${NC}"
  exit 1
fi

# Contador de sucesso/erro
SUCCESS=0
ERROR=0

# Upload de cada imagem da galeria
for IMG in "$LOCAL_UPLOADS"/gallery-*.jpeg "$LOCAL_UPLOADS"/gallery-*.jpg "$LOCAL_UPLOADS"/gallery-*.png; do
  if [ -f "$IMG" ]; then
    FILENAME=$(basename "$IMG")
    echo -n "📤 Uploading: $FILENAME ... "
    
    # Fazer upload
    UPLOAD_RESPONSE=$(curl -s -b "$COOKIE_FILE" -X POST "$RAILWAY_URL/api/admin/upload" \
      -F "file=@$IMG")
    
    if echo "$UPLOAD_RESPONSE" | grep -q "success"; then
      NEW_URL=$(echo "$UPLOAD_RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
      echo -e "${GREEN}✅ OK ($NEW_URL)${NC}"
      ((SUCCESS++))
    else
      echo -e "${RED}❌ Erro${NC}"
      ((ERROR++))
    fi
    
    # Pequeno delay para não sobrecarregar o servidor
    sleep 0.3
  fi
done

echo ""
echo "📊 Resumo da migração:"
echo -e "${GREEN}✅ Sucesso: $SUCCESS${NC}"
echo -e "${RED}❌ Erros: $ERROR${NC}"

# Limpar cookie
rm -f "$COOKIE_FILE"

echo ""
echo "⚠️ IMPORTANTE: Após o upload, você precisa atualizar as URLs no banco de dados."
echo "Execute o script de atualização de URLs para completar a migração."
