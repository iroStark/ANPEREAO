#!/bin/bash

# Script de migração Laravel -> Node.js
# Este script facilita a migração de dados do banco Laravel para o Node.js

set -e

echo "🚀 ANPERE - Migração Laravel → Node.js"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se DATABASE_URL está configurado
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERRO: DATABASE_URL não está configurado${NC}"
    echo ""
    echo "Por favor, configure a variável DATABASE_URL no arquivo .env"
    echo "Exemplo: DATABASE_URL=mysql://user:password@localhost:3306/anpere"
    echo ""
    exit 1
fi

echo -e "${YELLOW}⚙️  Configuração:${NC}"
echo "   SOURCE_DB_NAME: Banco de dados Laravel (origem)"
echo "   TARGET_DB_NAME: Banco de dados Node.js (destino)"
echo ""

# Perguntar nomes dos bancos
read -p "Nome do banco Laravel (origem) [anpere_laravel]: " SOURCE_DB
SOURCE_DB=${SOURCE_DB:-anpere_laravel}

read -p "Nome do banco Node.js (destino) [anpere]: " TARGET_DB
TARGET_DB=${TARGET_DB:-anpere}

echo ""
echo -e "${YELLOW}⚠️  AVISO: Este script vai:${NC}"
echo "   1. Criar o schema no banco '$TARGET_DB' (se não existir)"
echo "   2. Migrar todos os dados do '$SOURCE_DB' para '$TARGET_DB'"
echo "   3. Converter IDs bigint para UUIDs"
echo ""

read -p "Deseja continuar? (s/N): " CONFIRM
if [[ $CONFIRM != "s" && $CONFIRM != "S" ]]; then
    echo "❌ Operação cancelada."
    exit 0
fi

echo ""
echo -e "${GREEN}📦 Instalando dependências...${NC}"
cd "$(dirname "$0")/.."
npm install

echo ""
echo -e "${GREEN}🏗️  Criando schema no banco de destino...${NC}"
mysql -e "CREATE DATABASE IF NOT EXISTS $TARGET_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql $TARGET_DB < scripts/create-nodejs-schema.sql
echo -e "${GREEN}   ✅ Schema criado${NC}"

echo ""
echo -e "${GREEN}🔄 Executando migração de dados...${NC}"

# Extrair credenciais do DATABASE_URL
# Formato: mysql://user:pass@host:port/db
DB_URL="${DATABASE_URL}"

export SOURCE_DB_NAME=$SOURCE_DB
export TARGET_DB_NAME=$TARGET_DB

# Executar script de migração
npx tsx scripts/migrate-from-laravel.ts

echo ""
echo -e "${GREEN}✅ Migração concluída!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. Atualize o .env para apontar para o banco '$TARGET_DB'"
echo "   2. Teste a aplicação Node.js"
echo "   3. Faça backup do banco Laravel antes de removê-lo"
echo ""
