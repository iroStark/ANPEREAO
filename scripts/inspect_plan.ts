
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { activityPlan, activityPlanItems } from "../shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  // Find plan for 2026
  const plans = await db.select().from(activityPlan).where(eq(activityPlan.year, '2026'));
  
  if (plans.length === 0) {
    console.log("Nenhum plano para 2026 encontrado.");
    return;
  }
  
  const plan = plans[0];
  console.log(`Plano encontrado: ${plan.title} (${plan.year})`);
  
  const items = await db.select().from(activityPlanItems).where(eq(activityPlanItems.planId, plan.id));
  console.log(`Encontrados ${items.length} itens.`);
  
  if (items.length > 0) {
      console.log("Exemplo de item:", items[0]);
  }
  
  process.exit(0);
}

main();
