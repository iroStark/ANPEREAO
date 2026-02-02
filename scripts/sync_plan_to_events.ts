
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { activityPlan, activityPlanItems, events } from "../shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

if (!process.env.DATABASE_URL) {
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function inferType(activity: string): string {
    const lower = activity.toLowerCase();
    if (lower.includes('reunião') || lower.includes('reuniões')) return 'Reunião';
    if (lower.includes('workshop')) return 'Workshop';
    if (lower.includes('palestra')) return 'Palestra';
    if (lower.includes('visita')) return 'Visita';
    if (lower.includes('assemebleia') || lower.includes('assembleia')) return 'Assembleia';
    if (lower.includes('festa') || lower.includes('convívio')) return 'Social';
    if (lower.includes('conferência')) return 'Conferência';
    if (lower.includes('seminário')) return 'Seminário';
    return 'Evento Institucional';
}

async function main() {
  console.log("Sincronizando Plano de Atividades com Eventos...");

  // 1. Buscar plano 2026
  const plans = await db.select().from(activityPlan).where(eq(activityPlan.year, '2026'));
  
  if (plans.length === 0) {
    console.log("Nenhum plano para 2026 encontrado.");
    process.exit(0);
  }
  
  const plan = plans[0];
  const items = await db.select().from(activityPlanItems).where(eq(activityPlanItems.planId, plan.id));
  
  console.log(`Processando ${items.length} itens do plano...`);
  
  let insertedCount = 0;
  
  for (const item of items) {
       const existing = await db.select().from(events).where(eq(events.title, item.activity));
       
       if (existing.length > 0) {
           console.log(`\nEvento já existe: "${item.activity}". Pulando.`);
           continue;
       }

       await db.insert(events).values({
           id: randomUUID(),
           title: item.activity,
           description: `Atividade prevista no Plano de Atividades 2026.\n\nParticipantes previstos: ${item.participants || 'Não especificado'}.`,
           date: item.date || 'A definir',
           time: item.time || 'A definir',
           location: item.location || 'A definir',
           type: inferType(item.activity),
           capacity: null,
           publishedAt: new Date(),
           updatedAt: new Date()
       });
       
       insertedCount++;
       process.stdout.write(".");
  }

  console.log(`\nSincronização concluída! ${insertedCount} eventos adicionados.`);
  process.exit(0);
}

main().catch(console.error);
