/**
 * Importa dados do arquivo SQL MySQL para PostgreSQL
 */

import { Pool } from "pg";
import { randomUUID } from "crypto";
import * as fs from "fs";

// Mapeamento de IDs antigos (bigint) para novos UUIDs
const idMap: Record<string, Record<number, string>> = {};

function getUUID(table: string, oldId: number): string {
  if (!idMap[table]) idMap[table] = {};
  if (!idMap[table][oldId]) {
    idMap[table][oldId] = randomUUID();
  }
  return idMap[table][oldId];
}

async function importData() {
  const targetDb = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/anpere"
  });

  console.log("🚀 Iniciando importação de dados...\n");

  try {
    // Ler arquivo SQL
    const sqlContent = fs.readFileSync("../anpere_production.sql", "utf-8");
    
    // Extrair INSERT statements
    const insertRegex = /INSERT INTO `(\w+)` VALUES\s+((?:\([^)]+\),?\s*)+);/g;
    let match;
    
    while ((match = insertRegex.exec(sqlContent)) !== null) {
      const tableName = match[1];
      const valuesBlock = match[2];
      
      // Extrair valores individuais
      const rowRegex = /\(([^)]+)\)/g;
      let rowMatch;
      
      console.log(`📊 Processando tabela: ${tableName}`);
      let count = 0;
      
      while ((rowMatch = rowRegex.exec(valuesBlock)) !== null) {
        const row = rowMatch[1];
        count++;
        
        // Parse dos valores (simplificado)
        const values = row.split(",").map(v => {
          v = v.trim();
          if (v === "NULL") return null;
          if (v.startsWith("'") && v.endsWith("'")) {
            return v.slice(1, -1).replace(/\\'/g, "'").replace(/\\n/g, "\n");
          }
          return v;
        });
        
        try {
          await insertRow(targetDb, tableName, values);
        } catch (err: any) {
          console.error(`  ❌ Erro na linha ${count}:`, err.message);
        }
      }
      
      console.log(`   ✅ ${count} registros importados`);
    }

    console.log("\n✅✅✅ IMPORTAÇÃO CONCLUÍDA! ✅✅✅\n");

  } catch (error) {
    console.error("\n❌ Erro durante a importação:", error);
  } finally {
    await targetDb.end();
  }
}

async function insertRow(db: Pool, table: string, values: any[]) {
  // Mapeamento de tabelas e colunas
  const tableMapping: Record<string, { columns: string[]; transform?: (v: any[]) => any[] }> = {
    users: {
      columns: ["id", "username", "email", "password", "role", "is_active", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("users", parseInt(v[0])),
        v[7] || v[1] || `user_${v[0]}`, // username ou name
        v[2], // email
        v[4] || "$2b$10$WRzjAZWHGFqf7h2kPKC77.Gun/lvaN8wpPvoudRp0A3GUq/YXUCey", // password
        v[8] || "admin", // role (limitado a 20 chars, então usamos valor curto)
        v[9] === "1" || v[9] === 1 ? true : false, // is_active
        v[6] || new Date().toISOString(), // created_at
        v[7] || new Date().toISOString()  // updated_at (repetido se necessário)
      ]
    },
    about_contents: {
      columns: ["id", "section", "title", "content", "updated_at"],
      transform: (v) => [
        getUUID("about_contents", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4] || new Date().toISOString()
      ]
    },
    timeline_events: {
      columns: ["id", "year", "event", "description", "details", "image_url", "order", "is_active", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("timeline_events", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        parseInt(v[6]) || 0,
        v[7] === "1" || v[7] === 1 ? true : false,
        v[8] || new Date().toISOString(),
        v[9] || new Date().toISOString()
      ]
    },
    legislations: {
      pgTable: "legislation",
      columns: ["id", "title", "description", "category", "year", "icon", "content", "file_url", "published_at", "updated_at"],
      transform: (v) => [
        getUUID("legislations", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5] || "BookOpen",
        v[6],
        v[7],
        v[8] || new Date().toISOString(),
        v[9] || new Date().toISOString()
      ]
    },
    publications: {
      columns: ["id", "title", "description", "category", "date", "file_url", "download_url", "published_at", "updated_at"],
      transform: (v) => [
        getUUID("publications", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6],
        v[7] || new Date().toISOString(),
        v[8] || new Date().toISOString()
      ]
    },
    events: {
      columns: ["id", "title", "description", "date", "time", "location", "type", "capacity", "registration_url", "published_at", "updated_at"],
      transform: (v) => [
        getUUID("events", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6],
        v[7],
        v[8],
        v[9] || new Date().toISOString(),
        v[10] || new Date().toISOString()
      ]
    },
    galleries: {
      pgTable: "gallery",
      columns: ["id", "title", "description", "type", "date", "category", "views", "duration", "thumbnail", "media_url", "published_at", "updated_at"],
      transform: (v) => [
        getUUID("galleries", parseInt(v[0])),
        v[1],
        v[2],
        v[3] || "image",
        v[4],
        v[5] || "Geral",
        parseInt(v[6]) || 0,
        v[7],
        v[8],
        v[9],
        v[10] || new Date().toISOString(),
        v[11] || new Date().toISOString()
      ]
    },
    members: {
      columns: ["id", "member_number", "full_name", "birth_date", "birth_place", "nationality", "gender", "marital_status", "id_document", "id_issue_date", "id_issue_place", "father_name", "mother_name", "occupation", "phone", "current_address", "municipality", "work_province", "email", "photo_url", "other_info", "registration_date", "status", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("members", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6],
        v[7],
        v[8],
        v[9],
        v[10],
        v[11],
        v[12],
        v[13],
        v[14],
        v[15],
        v[16],
        v[17],
        v[18],
        v[19],
        v[20],
        v[21] || new Date().toISOString(),
        v[22] || "pending",
        v[23] || new Date().toISOString(),
        v[24] || new Date().toISOString()
      ]
    },
    slideshows: {
      pgTable: "slideshow",
      columns: ["id", "title", "subtitle", "description", "image_url", "\"order\"", "is_active", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("slideshows", parseInt(v[0])),
        v[1], // title
        v[2], // subtitle
        v[1] || "", // description (usamos title se não houver)
        v[3] || "", // image_url (não pode ser null)
        parseInt(v[5]) || 0, // order_index
        v[6] === "1" || v[6] === 1 ? true : false, // active
        v[7] || new Date().toISOString(), // created_at
        v[8] || new Date().toISOString() // updated_at
      ]
    },
    activity_plans: {
      pgTable: "activity_plan",
      columns: ["id", "year", "title", "description", "is_active", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("activity_plans", parseInt(v[0])),
        v[1],
        v[2] || "Plano de Atividades",
        v[3],
        v[4] === "1" || v[4] === 1 ? true : false,
        v[5] || new Date().toISOString(),
        v[6] || new Date().toISOString()
      ]
    },
    activity_plan_items: {
      columns: ["id", "plan_id", "number", "activity", "date", "time", "location", "participants", "order", "parent_id", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("activity_plan_items", parseInt(v[0])),
        v[1] ? getUUID("activity_plans", parseInt(v[1])) : null,
        parseInt(v[2]) || 0,
        v[3],
        v[4],
        v[5],
        v[6],
        v[7],
        parseInt(v[8]) || 0,
        v[9],
        v[10] || new Date().toISOString(),
        v[11] || new Date().toISOString()
      ]
    },
    social_orgaos: {
      pgTable: "orgaos_sociais",
      columns: ["id", "name", "position", "organ_type", "bio", "photo_url", "email", "phone", "order_index", "is_active", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("social_orgaos", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6],
        v[7],
        parseInt(v[8]) || 0,
        v[9] === "1" || v[9] === 1 ? true : false,
        v[10] || new Date().toISOString(),
        v[11] || new Date().toISOString()
      ]
    },
    contact_messages: {
      columns: ["id", "name", "email", "phone", "subject", "message", "is_read", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("contact_messages", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4],
        v[5],
        v[6] === "read" || v[6] === "1" ? true : false,
        v[7] || new Date().toISOString(),
        v[8] || new Date().toISOString()
      ]
    },
    notifications: {
      columns: ["id", "type", "title", "message", "link", "is_read", "related_id", "created_at", "read_at"],
      transform: (v) => [
        getUUID("notifications", parseInt(v[0])),
        v[1] || "info",
        v[2],
        v[3],
        v[4],
        v[5] === "1" || v[5] === 1 ? true : false,
        v[6],
        v[7] || new Date().toISOString(),
        v[8]
      ]
    },
    reports: {
      columns: ["id", "title", "description", "type", "status", "period", "file_url", "created_at", "updated_at"],
      transform: (v) => [
        getUUID("reports", parseInt(v[0])),
        v[1],
        v[2],
        v[3],
        v[4] || "draft",
        v[5],
        v[6],
        v[7] || new Date().toISOString(),
        v[8] || new Date().toISOString()
      ]
    }
  };

  const mapping = tableMapping[table];
  if (!mapping) {
    console.log(`  ⚠️ Tabela ${table} ignorada`);
    return;
  }

  const pgTable = (mapping as any).pgTable || table;
  const transformedValues = mapping.transform ? mapping.transform(values) : values;
  
  // Construir query INSERT
  const placeholders = transformedValues.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO ${pgTable} (${mapping.columns.join(", ")}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`;
  
  await db.query(query, transformedValues);
}

importData();
