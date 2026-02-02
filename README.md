# ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico

Sistema web completo para a ANPERE, migrado de Laravel para Node.js.

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Drizzle ORM
- **Banco de Dados**: MySQL
- **Autenticação**: Session-based (Express Session)

## 📁 Estrutura do Projeto

```
ANPERE/
├── react-app/              # Aplicação principal (Frontend + Backend)
│   ├── client/            # Frontend React
│   │   └── src/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       └── lib/
│   ├── server/            # Backend Express
│   │   ├── index.ts       # Entry point
│   │   ├── routes.ts      # API routes
│   │   └── storage.ts     # Database operations
│   ├── shared/            # Schema Drizzle
│   │   └── schema.ts
│   └── scripts/           # Scripts de migração
├── scripts/               # Scripts utilitários
└── backups/              # Backups automáticos
```

## 🛠️ Setup

### 1. Instalar Dependências

```bash
cd react-app
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Configurar Banco de Dados

```bash
# Criar banco de dados
mysql -e "CREATE DATABASE anpere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Executar schema
mysql anpere < scripts/create-nodejs-schema.sql
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start
```

## 🔄 Migração do Laravel

Se você está migrando de uma instalação Laravel existente:

```bash
cd react-app
npm run migrate:laravel
```

Veja [MIGRATION_LARAVEL_TO_NODEJS.md](MIGRATION_LARAVEL_TO_NODEJS.md) para detalhes completos.

## 🗑️ Remover Laravel

Após confirmar que a migração funcionou:

```bash
# Do diretório raiz
./scripts/remove-laravel.sh
```

## 📚 Documentação

- [Migração Laravel → Node.js](MIGRATION_LARAVEL_TO_NODEJS.md)
- [Deploy no cPanel](DEPLOY_C_PANEL.md)

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run check            # Verificação de TypeScript

# Banco de Dados
npm run db:push          # Push schema Drizzle
npm run migrate:laravel  # Migrar dados do Laravel

# Scripts
./scripts/remove-laravel.sh  # Remover Laravel com backup
```

## 🔐 Credenciais Padrão

Após a instalação, o sistema cria automaticamente um usuário admin:

- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Importante**: Altere a senha padrão após o primeiro login!

## 🆘 Suporte

Em caso de problemas:

1. Verifique o arquivo `.env`
2. Confira se o MySQL está rodando
3. Verifique as permissões do banco de dados
4. Consulte os logs no console

## 📄 Licença

Este projeto é privado e desenvolvido para a ANPERE.
