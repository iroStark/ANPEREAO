
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { gallery } from "../shared/schema";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import { fileURLToPath } from 'url';

// Fix __dirname for ESM if needed, but tsx handles CJS fine usually. 
// However, assuming this is module context due to 'import'.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const SOURCE_DIR = "/Users/istark/Downloads/ANPERE/Galeria ANpere";
const TARGET_DIR = path.resolve(process.cwd(), "uploads");

const CATEGORIES = ["Evento", "Workshop", "Networking", "Palestra", "Visita"];
const DESCRIPTIONS = [
  "Registo fotográfico de atividades e presença institucional da ANPERE.",
  "Momento de partilha e networking entre profissionais do setor.",
  "Participação em evento oficial representando a associação.",
  "Atividade técnica para desenvolvimento do espectro radioelétrico.",
  "Reunião de membros e parceiros estratégicos."
];

async function main() {
  console.log("Iniciando importação da galeria...");
  
  if (!fs.existsSync(SOURCE_DIR)) {
      console.error(`Diretório de origem não encontrado: ${SOURCE_DIR}`);
      process.exit(1);
  }

  // 1. Limpar galeria existente
  console.log("Limpando galeria existente no banco de dados...");
  try {
    await db.delete(gallery);
    console.log("Galeria limpa com sucesso.");
  } catch (e) {
    console.error("Erro ao limpar tabela gallery:", e);
    process.exit(1);
  }

  // 2. Ler arquivos
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.match(/\.(jpeg|jpg|png|webp|JPG|JPEG|PNG)$/i));
  console.log(`Encontradas ${files.length} imagens para importar.`);

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 3. Importar
  let count = 0;
  for (const file of files) {
    count++;
    const sourcePath = path.join(SOURCE_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const newFileName = `gallery-${Date.now()}-${count}${ext}`;
    const targetPath = path.join(TARGET_DIR, newFileName);

    // Copiar arquivo
    try {
        fs.copyFileSync(sourcePath, targetPath);
    } catch (err) {
        console.error(`Erro ao copiar arquivo ${file}:`, err);
        continue;
    }

    // Gerar metadados
    const category = CATEGORIES[count % CATEGORIES.length];
    const description = DESCRIPTIONS[count % DESCRIPTIONS.length];
    const title = `${category} ANPERE - Registo #${String(count).padStart(3, '0')}`;
    
    // Gerar uma data para timeline
    const dateObj = new Date(2025, 8, 1); // Setembro 2025
    dateObj.setDate(dateObj.getDate() + (count % 30)); // Espalha no mês
    const dateStr = dateObj.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

    await db.insert(gallery).values({
      id: randomUUID(),
      title: title,
      description: description,
      type: 'image',
      category: category,
      date: dateStr,
      mediaUrl: `/uploads/${newFileName}`,
      thumbnail: `/uploads/${newFileName}`, 
      views: Math.floor(Math.random() * 200),
      duration: null,
      publishedAt: new Date(),
      updatedAt: new Date()
    });
    
    if (count % 5 === 0) process.stdout.write(".");
  }

  console.log(`\nImportação concluída! ${count} imagens adicionadas à galeria.`);
  process.exit(0);
}

main().catch(console.error);
