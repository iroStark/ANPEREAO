# Guia de Instalação no cPanel (AngoWeb)

Este guia descreve passo a passo como hospedar o portal ANPERE no cPanel da AngoWeb com os dados de produção atuais.

## Pré-requisitos
Certifique-se de que tem os seguintes ficheiros gerados:
1.  **anpere_production.sql** - Backup da base de dados com todos os dados atuais.
2.  **frontend_build.zip** - O código do site (React) compilado.
3.  **backend_laravel.zip** - O código do sistema (Laravel) para a API.

---

## Passo 1: Configurar a Base de Dados

1.  Aceda ao **cPanel**.
2.  Vá a **Bases de Dados MySQL** (MySQL Databases).
3.  **Criar Nova Base de Dados**: Escreva `anpere` (ou outro nome, ex: `sitedo_anpere`) e clique em "Criar Base de Dados".
4.  **Criar Utilizador MySQL**:
    *   Ex: `sitedo_admin`
    *   Gerar uma senha forte (GUARDAR ESTA SENHA).
    *   Clique em "Criar Utilizador".
5.  **Adicionar Utilizador à Base de Dados**:
    *   Selecione o utilizador criado e a base de dados criada.
    *   Clique em "Adicionar".
    *   Marque **TODOS OS PRIVILÉGIOS** e confirme.

## Passo 2: Importar os Dados

1.  No cPanel, vá a **phpMyAdmin**.
2.  Selecione a base de dados que acabou de criar na barra lateral esquerda.
3.  Clique na aba **Importar** (Import).
4.  Selecione o ficheiro `anpere_production.sql`.
5.  Clique em **Executar** (Go) no fundo da página.
    *   *Sucesso*: Verá uma mensagem verde confirmando a importação das tabelas e dados.

## Passo 3: Hospedar a API (Backend)

Recomendamos usar um subdomínio (ex: `api.seudominio.com`) para o backend para separar do site principal.

1.  No cPanel, crie um **Subdomínio** chamado `api` (o diretório root será algo como `public_html/api` ou `api.seudominio.com`).
2.  Vá ao **Gestor de Ficheiros** (File Manager).
3.  Navegue para a pasta do subdomínio (ex: `api.seudominio.com`).
4.  Clique em **Carregar** (Upload) e envie o ficheiro `backend_laravel.zip`.
5.  Extraia o ficheiro zip na pasta.
6.  **Configurar o ambiente (.env)**:
    *   Renomeie `.env.example` para `.env`.
    *   Edite o ficheiro `.env`:
        ```ini
        APP_URL=https://api.seudominio.com
        APP_ENV=production
        APP_DEBUG=false

        DB_DATABASE=sitedo_anpere
        DB_USERNAME=sitedo_admin
        DB_PASSWORD=sua_senha_forte_aqui
        ```
7.  **Instalar Dependências (via terminal do cPanel ou SSH)**:
    *   Se tiver acesso SSH: `composer install --optimize-autoloader --no-dev`.
    *   Se não, terá de carregar a pasta `vendor` (não incluída no zip para poupar espaço) ou usar a ferramenta "PHP Composer" do cPanel se disponível.
8.  **Link Simbólico para Storage**:
    *   É crucial para as imagens funcionarem. No terminal/SSH: `php artisan storage:link`.
    *   Se não tiver SSH, crie um ficheiro PHP temporário `link.php` na pasta da API:
        ```php
        <?php
        symlink('/home/user/api.domain.com/storage/app/public', '/home/user/api.domain.com/public/storage');
        echo "Link criado!";
        ?>
        ```
    *   Aceda a `https://api.seudominio.com/link.php` uma vez e depois apague-o.

## Passo 4: Hospedar o Site (Frontend)

1.  No Gestor de Ficheiros, vá à pasta **public_html** (esta é a raiz do seu site principal).
2.  Limpe ficheiros antigos (se existirem, cuidado para não apagar a pasta `api` se ela estiver dentro de public_html).
3.  Clique em **Carregar** e envie o `frontend_build.zip`.
4.  Extraia o conteúdo.
5.  **Mova os ficheiros**: Certifique-se que o conteúdo da pasta `public` extraída fica diretamente na raiz `public_html`.
    *   *Nota*: Deve ver o `index.html` logo dentro de `public_html`.
6.  **Configurar Rotas (React)**:
    *   Se não existir, crie um ficheiro `.htaccess` em `public_html`:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

## Passo Final: Testes

1.  Aceda ao seu site principal `www.seudominio.com`.
2.  Verifique se o slideshow e as secções carregam (isso confirma que a API está a responder).
3.  Tente fazer login em `www.seudominio.com/admin/login` com:
    *   User: `admin`
    *   Pass: `admin123`

---
**Nota Importante sobre Imagens**:
Como estamos a mover de `localhost`, algumas imagens na base de dados podem ter caminhos absolutos antigos se não foram guardadas como relativos.
O sistema foi configurado para usar `/storage/...`, o que deve funcionar automaticamente desde que o passo do "Link Simbólico" (Passo 3.8) tenha sido feito corretamente.
