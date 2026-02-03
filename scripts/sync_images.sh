#!/bin/bash

# Script para sincronizar imagens mantendo os nomes originais
# Este script usa o endpoint /api/admin/upload-sync que preserva o nome do arquivo

RAILWAY_URL="https://anpereao-production.up.railway.app"
LOCAL_UPLOADS="./uploads"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
COOKIE_FILE="/tmp/railway_session.txt"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Sincronizando imagens com nomes originais..."
echo ""

# Login
echo "🔐 Fazendo login..."
LOGIN_RESPONSE=$(curl -s -c "$COOKIE_FILE" -X POST "$RAILWAY_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")

if ! echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo -e "${RED}❌ Falha no login. Verifique as credenciais.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Login OK${NC}"
echo ""

# Contador
SUCCESS=0
ERROR=0
TOTAL=0

# Upload de cada imagem da galeria
echo "📤 Iniciando upload de imagens..."
echo ""

for IMG in "$LOCAL_UPLOADS"/gallery-*.jpeg "$LOCAL_UPLOADS"/gallery-*.jpg "$LOCAL_UPLOADS"/gallery-*.png; do
  if [ -f "$IMG" ]; then
    FILENAME=$(basename "$IMG")
    echo -n "📤 $FILENAME ... "
    
    # Fazer upload usando o endpoint sync que preserva o nome
    UPLOAD_RESPONSE=$(curl -s -b "$COOKIE_FILE" -X POST "$RAILWAY_URL/api/admin/upload-sync" \
      -F "file=@$IMG")
    
    if echo "$UPLOAD_RESPONSE" | grep -q "success"; then
      echo -e "${GREEN}✅${NC}"
      ((SUCCESS++))
    else
      echo -e "${RED}❌${NC}"
      ((ERROR++))
    fi
    ((TOTAL++))
    
    # Pequeno delay
    sleep 0.2
  fi
done

echo ""
echo "================================================"
echo "📊 Resumo da sincronização:"
echo -e "${GREEN}✅ Sucesso: $SUCCESS${NC}"
echo -e "${RED}❌ Erros: $ERROR${NC}"
echo "📁 Total: $TOTAL"
echo "================================================"

# Limpar cookie
rm -f "$COOKIE_FILE"

if [ $SUCCESS -gt 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 Sincronização concluída!${NC}"
  echo "As imagens agora estão disponíveis no Railway."
  echo "Acesse a galeria para verificar: $RAILWAY_URL/galeria"
fi
