# 🚀 Migração Laravel → Node.js

Este documento descreve o processo de migração do backend Laravel para Node.js/Express.

## 📋 Resumo

- **Laravel**: PHP 8.2 + Eloquent ORM + Sanctum Auth
- **Node.js**: Express + Drizzle ORM + Session Auth
- **Banco**: MySQL (mantido, apenas estrutura convertida)

## 🔑 Principais Mudanças

### IDs
- **Laravel**: `BIGINT UNSIGNED AUTO_INCREMENT`
- **Node.js**: `UUID (VARCHAR 36)`

### Autenticação
- **Laravel**: Laravel Sanctum (Token-based)
- **Node.js**: Express Session (Session-based)

### ORM
- **Laravel**: Eloquent
- **Node.js**: Drizzle ORM

## 🗂️ Estrutura de Arquivos

```
react-app/
├── server/              # Backend Node.js
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   └── vite.ts         # Vite config
├── shared/
│   └── schema.ts       # Drizzle schema definitions
├── scripts/
│   ├── migrate-laravel-to-node.sh  # Script de migração
│   ├── migrate-from-laravel.ts     # Lógica de migração
│   └── create-nodejs-schema.sql    # Schema SQL
└── package.json
```

## 🔄 Processo de Migração

### 1. Pré-requisitos

```bash
# Verificar se MySQL está rodando
mysql --version

# Verificar variáveis de ambiente
cat react-app/.env | grep DATABASE_URL
```

### 2. Configurar Banco de Dados

```bash
cd react-app

# Configurar DATABASE_URL no .env
# Formato: mysql://user:password@host:port/database

# Executar migração
npm run migrate:laravel
```

### 3. Migração Manual (Alternativa)

Se o script automático falhar:

```bash
# 1. Criar banco de destino
mysql -e "CREATE DATABASE anpere_nodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Criar schema
mysql anpere_nodejs < scripts/create-nodejs-schema.sql

# 3. Executar migração de dados
npx tsx scripts/migrate-from-laravel.ts
```

## 📊 Mapeamento de Tabelas

| Laravel Table | Node.js Table | Status |
|--------------|---------------|--------|
| users | users | ✅ Migrado |
| about_contents | about_content | ✅ Migrado |
| timeline_events | timeline_events | ✅ Migrado |
| legislations | legislation | ✅ Migrado |
| publications | publications | ✅ Migrado |
| events | events | ✅ Migrado |
| galleries | gallery | ✅ Migrado |
| reports | reports | ✅ Migrado |
| settings | settings | ✅ Migrado |
| members | members | ✅ Migrado |
| slideshows | slideshow | ✅ Migrado |
| activity_plans | activity_plan | ✅ Migrado |
| activity_plan_items | activity_plan_items | ✅ Migrado |
| social_orgaos | orgaos_sociais | ✅ Migrado |
| contact_messages | contact_messages | ✅ Migrado |
| notifications | notifications | ✅ Migrado |

## 🗑️ Tabelas Removidas (Laravel-only)

- `cache` - Cache do Laravel
- `cache_locks` - Locks de cache
- `failed_jobs` - Jobs falhos
- `job_batches` - Batches de jobs
- `jobs` - Queue jobs
- `migrations` - Controle de migrações
- `password_reset_tokens` - Reset de senha
- `personal_access_tokens` - Tokens Sanctum
- `sessions` - Sessions do Laravel

## 🔐 Migração de Usuários

Os usuários são migrados com as senhas em hash (bcrypt). Como ambos os sistemas usam bcrypt, a senha funciona em ambos.

```sql
-- Senha padrão do admin: admin123
-- Hash bcrypt compatível
```

## 📁 Migração de Arquivos

Os arquivos uploadados precisam ser movidos manualmente:

```bash
# De (Laravel)
backend-laravel/storage/app/public/
backend-laravel/public/assets/

# Para (Node.js)
react-app/uploads/
react-app/attached_assets/
```

## 🧪 Testes

### Verificar Migração

```bash
# Conectar ao banco
docker-compose exec db mysql -u root -p

-- Verificar tabelas
USE anpere_nodejs;
SHOW TABLES;

-- Verificar contagem de registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM members;
SELECT COUNT(*) FROM gallery;
```

### Testar API

```bash
# Iniciar servidor
cd react-app
npm run dev

# Testar endpoints
curl http://localhost:5000/api/slideshow
curl http://localhost:5000/api/events
```

## 🚀 Deploy

### Build

```bash
cd react-app
npm run build
```

### Produção

```bash
npm run start
```

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"
- Verificar DATABASE_URL
- Verificar se MySQL está rodando
- Verificar permissões do usuário

### Erro: "Table doesn't exist"
- Executar schema SQL primeiro
- Verificar nome do banco de dados

### Erro: "Duplicate entry"
- Migração já foi executada
- Limpar banco de destino e tentar novamente

## ✅ Checklist Pós-Migração

- [ ] Todos os dados migrados
- [ ] Usuários conseguem fazer login
- [ ] Uploads funcionando
- [ ] API respondendo corretamente
- [ ] Frontend funcionando
- [ ] Backup do banco Laravel realizado
- [ ] Pasta backend-laravel removida

## 📝 Notas

- A migração preserva todos os dados existentes
- IDs são convertidos de bigint para UUID
- Senhas funcionam sem necessidade de reset
- Arquivos devem ser copiados manualmente
