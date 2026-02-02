# ANPERE - Deploy no Railway

## 🚀 Deploy em Um Clique

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.app/template/ANPEREAO?referralCode=)

## 📋 Pré-requisitos

- Conta no [Railway.com](https://railway.app)
- Repositório GitHub conectado

## 🔧 Variáveis de Ambiente Necessárias

Configure estas variáveis no Railway:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Chave secreta para sessões | (gerar string aleatória) |
| `NODE_ENV` | Ambiente | `production` |
| `PORT` | Porta (auto-definida pelo Railway) | `${{PORT}}` |

## 📦 Deploy Manual

1. **Criar Novo Projeto no Railway**
   ```bash
   railway login
   railway init
   ```

2. **Adicionar PostgreSQL**
   - No dashboard, clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
   - A variável `DATABASE_URL` será configurada automaticamente

3. **Conectar ao GitHub**
   - Conecte o repositório GitHub ao Railway
   - O deploy será feito automaticamente a cada push

4. **Deploy**
   ```bash
   railway up
   ```

## 🏗️ Estrutura do Projeto

```
├── client/           # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── contexts/
├── server/           # Backend Node.js + Express
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/           # Código partilhado (schemas)
└── uploads/          # Ficheiros estáticos
```

## 🔒 Funcionalidades

- ✅ Autenticação com sessões
- ✅ Painel de administração
- ✅ Gestão de membros, eventos, galeria
- ✅ Slideshow dinâmico
- ✅ Órgãos sociais
- ✅ Plano de atividades

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Drizzle ORM
- **Base de Dados**: PostgreSQL
- **Build**: Vite

## 📞 Suporte

ANPERE - Associação Nacional dos Profissionais do Espectro Rádio Eletrónico
