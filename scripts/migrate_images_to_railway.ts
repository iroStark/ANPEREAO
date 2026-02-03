/**
 * Script para migrar imagens locais para o Railway
 * Este script faz upload de todas as imagens da galeria para o servidor de produção
 * e atualiza as URLs no banco de dados.
 */

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const RAILWAY_URL = 'https://anpereao-production.up.railway.app';
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Store session cookie
let sessionCookie: string = '';

async function login(): Promise<boolean> {
  console.log('🔐 Fazendo login no servidor...');
  
  const response = await fetch(`${RAILWAY_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    console.error('❌ Falha no login:', await response.text());
    return false;
  }

  // Get session cookie from response
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    sessionCookie = setCookie.split(';')[0];
    console.log('✅ Login bem-sucedido!');
    return true;
  }

  console.log('⚠️ Login OK mas sem cookie de sessão');
  return true;
}

async function uploadFile(filePath: string): Promise<string | null> {
  const fileName = path.basename(filePath);
  console.log(`📤 Uploading: ${fileName}`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await fetch(`${RAILWAY_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie,
      },
      body: formData as any,
    });

    if (!response.ok) {
      console.error(`❌ Erro ao fazer upload de ${fileName}:`, response.status);
      return null;
    }

    const result = await response.json() as { url: string };
    console.log(`✅ Upload OK: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ Erro ao fazer upload de ${fileName}:`, error);
    return null;
  }
}

async function getGalleryItems(): Promise<any[]> {
  console.log('📋 Buscando itens da galeria...');
  
  const response = await fetch(`${RAILWAY_URL}/api/admin/gallery`, {
    headers: {
      'Cookie': sessionCookie,
    },
  });

  if (!response.ok) {
    console.error('❌ Erro ao buscar galeria:', response.status);
    return [];
  }

  const items = await response.json();
  console.log(`📋 Encontrados ${(items as any[]).length} itens na galeria`);
  return items as any[];
}

async function updateGalleryItem(id: string, mediaUrl: string, thumbnailUrl: string): Promise<boolean> {
  const response = await fetch(`${RAILWAY_URL}/api/admin/gallery/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie,
    },
    body: JSON.stringify({
      mediaUrl,
      thumbnailUrl,
    }),
  });

  return response.ok;
}

async function migrateImages() {
  console.log('🚀 Iniciando migração de imagens...\n');

  // Login first
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('❌ Não foi possível fazer login. Abortando.');
    process.exit(1);
  }

  // Get gallery items
  const items = await getGalleryItems();
  
  let successCount = 0;
  let errorCount = 0;

  for (const item of items) {
    const localFileName = item.mediaUrl.replace('/uploads/', '');
    const localFilePath = path.join(LOCAL_UPLOADS_DIR, localFileName);

    if (!fs.existsSync(localFilePath)) {
      console.log(`⚠️ Arquivo não encontrado: ${localFilePath}`);
      errorCount++;
      continue;
    }

    // Upload the file
    const newUrl = await uploadFile(localFilePath);
    
    if (newUrl) {
      // Update the gallery item with new URL
      const updated = await updateGalleryItem(item.id, newUrl, newUrl);
      if (updated) {
        successCount++;
        console.log(`✅ Item atualizado: ${item.title}`);
      } else {
        errorCount++;
        console.log(`❌ Erro ao atualizar item: ${item.title}`);
      }
    } else {
      errorCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Resumo da migração:');
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
}

migrateImages().catch(console.error);
