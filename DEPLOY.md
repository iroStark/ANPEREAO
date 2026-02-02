# Deploy no Railway - ANPERE

## 📋 Pré-requisitos

- [Railway CLI](https://docs.railway.app/develop/cli) instalado
- Conta no [Railway](https://railway.app)
- Node.js 20+ localmente

## 🚀 Deploy Rápido

### 1. Login e Setup Inicial

```bash
# Instalar Railway CLI (se não tiver)
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto (primeira vez)
railway init
```

### 2. Configurar Variáveis de Ambiente

No dashboard do Railway, adicione estas variáveis:

```env
NODE_ENV=production
PORT=5000
SESSION_SECRET= sua-chave-secreta-aqui-minimo-32-caracteres
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sua-senha-segura-aqui
```

### 3. Adicionar PostgreSQL

```bash
# Via CLI
railway add --database postgres

# Ou no dashboard: New → Database → Add PostgreSQL
```

A variável `DATABASE_URL` será criada automaticamente.

### 4. Backup das Imagens (IMPORTANTE)

Antes do primeiro deploy, faça backup das imagens:

```bash
./scripts/backup-uploads.sh
```

Isso criará um arquivo em `backups/uploads_backup_YYYYMMDD_HHMMSS.tar.gz`

### 5. Deploy

```bash
# Deploy automático (recomendado)
./scripts/deploy-railway.sh

# Ou manualmente
railway up
```

## 📁 Estrutura de Deploy

```
📦 anpere-website/
├── 📄 Dockerfile              # Configuração Docker
├── 📄 railway.json            # Configuração Railway
├── 📄 nixpacks.toml           # Configuração alternativa
├── 📄 docker-compose.yml      # Teste local
├── 📁 scripts/
│   ├── backup-uploads.sh      # Backup de imagens
│   ├── restore-uploads.sh     # Restauração de imagens
│   └── deploy-railway.sh      # Deploy automatizado
└── 📁 uploads/                # Imagens (serão persistidas via volume)
```

## 🔧 Configurações Importantes

### Sessões Persistentes
- Usamos `connect-pg-simple` para guardar sessões no PostgreSQL
- As sessões persistem entre restarts do servidor
- Cookie configurado para 7 dias

### CORS
- Permitido o domínio do Railway automaticamente
- Em desenvolvimento: localhost:5001, localhost:5173

### Health Check
- Endpoint: `/api/health`
- Retorna: `{ status: "ok", timestamp: "...", version: "2.0.0" }`

## 📊 Monitoramento

```bash
# Ver logs
railway logs

# Ver status
railway status

# Abrir no navegador
railway open
```

## 🔄 Atualizações

Para atualizar o deploy:

```bash
# 1. Backup das imagens
./scripts/backup-uploads.sh

# 2. Deploy
./scripts/deploy-railway.sh
```

## ⚠️ Troubleshooting

### Problema: "Build failed"
```bash
# Limpar e reinstalar
rm -rf node_modules dist
npm ci
npm run build
```

### Problema: "Database connection failed"
- Verifique se a variável `DATABASE_URL` está configurada
- No Railway Dashboard: Variables → Add `DATABASE_URL`

### Problema: "Images not showing"
- As imagens são armazenadas em `uploads/`
- No primeiro deploy, restaure o backup: `./scripts/restore-uploads.sh backups/uploads_backup_xxx.tar.gz`

## 📝 Notas

- O Railway usa **porta 5000** por padrão
- A pasta `uploads/` é persistida entre deploys via volumes
- Sessões são armazenadas no PostgreSQL (tabela `session`)
- Build usa Docker multi-stage (mais rápido e seguro)
