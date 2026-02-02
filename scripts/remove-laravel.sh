#!/bin/bash

# Script de remoção segura do Laravel
# Faz backup antes de remover

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🗑️  Remoção do Backend Laravel${NC}"
echo "=============================="
echo ""

# Verificar se está no diretório correto
if [ ! -d "backend-laravel" ]; then
    echo -e "${RED}❌ Erro: Pasta backend-laravel não encontrada${NC}"
    echo "Execute este script do diretório raiz do projeto"
    exit 1
fi

if [ ! -d "react-app" ]; then
    echo -e "${RED}❌ Erro: Pasta react-app não encontrada${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação vai:${NC}"
echo "   1. Criar backup do backend-laravel"
echo "   2. Remover a pasta backend-laravel permanentemente"
echo ""

read -p "Tem certeza que deseja continuar? (s/N): " CONFIRM
if [[ $CONFIRM != "s" && $CONFIRM != "S" ]]; then
    echo "❌ Operação cancelada."
    exit 0
fi

# Criar diretório de backups
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo ""
echo -e "${GREEN}📦 Criando backup...${NC}"

# Backup do código
tar -czf "$BACKUP_DIR/backend-laravel.tar.gz" backend-laravel/

# Backup do banco (se configurado)
if [ -f "react-app/.env" ]; then
    source react-app/.env
    if [ ! -z "$DATABASE_URL" ]; then
        echo -e "${GREEN}💾 Fazendo backup do banco de dados...${NC}"
        # Extrair nome do banco da URL
        DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\(.*\)/\1/p')
        mysqldump "$DB_NAME" > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || echo "   ⚠️  Não foi possível fazer backup do banco (verifique DATABASE_URL)"
    fi
fi

echo -e "${GREEN}   ✅ Backup criado em: $BACKUP_DIR${NC}"

echo ""
echo -e "${GREEN}🗑️  Removendo backend-laravel...${NC}"
rm -rf backend-laravel/
echo -e "${GREEN}   ✅ Backend Laravel removido${NC}"

echo ""
echo -e "${GREEN}✅✅✅ REMOÇÃO CONCLUÍDA ✅✅✅${NC}"
echo ""
echo "📋 Resumo:"
echo "   • Backup salvo em: $BACKUP_DIR"
echo "   • Laravel removido permanentemente"
echo ""
echo "🚀 O sistema agora usa apenas Node.js!"
echo ""
echo "📖 Para iniciar o servidor:"
echo "   cd react-app && npm run dev"
echo ""
