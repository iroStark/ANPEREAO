/**
 * Script de migração MySQL -> PostgreSQL
 * Importa todos os dados do backend Laravel MySQL para o PostgreSQL local
 */

import { Pool } from 'pg';
import * as mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';

// Configurações das bases de dados
const mysqlConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'anpere',
  password: 'anpere123',
  database: 'anpere'
};

const postgresConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/anpere'
};

async function migrate() {
  console.log('🚀 Iniciando migração MySQL -> PostgreSQL...\n');
  
  // Conectar ao MySQL
  const mysqlConn = await mysql.createConnection(mysqlConfig);
  console.log('✅ Conectado ao MySQL');
  
  // Conectar ao PostgreSQL
  const pgPool = new Pool(postgresConfig);
  const pgClient = await pgPool.connect();
  console.log('✅ Conectado ao PostgreSQL\n');
  
  try {
    // =========================================
    // 1. MIGRAR USERS
    // =========================================
    console.log('📋 Migrando users...');
    const [mysqlUsers] = await mysqlConn.query('SELECT * FROM users');
    for (const user of mysqlUsers as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at, last_login_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (username) DO NOTHING
        `, [
          id,
          user.username || user.name?.toLowerCase().replace(/\s+/g, '') || 'admin',
          user.email,
          user.password,
          user.role || 'admin',
          user.is_active ?? true,
          user.created_at,
          user.updated_at,
          user.last_login_at
        ]);
      } catch (e) {
        console.log(`  ⚠️ User ${user.email} já existe ou erro`);
      }
    }
    console.log(`  ✅ ${(mysqlUsers as any[]).length} users processados\n`);

    // =========================================
    // 2. MIGRAR GALLERIES
    // =========================================
    console.log('📋 Migrando galleries...');
    const [mysqlGalleries] = await mysqlConn.query('SELECT * FROM galleries');
    let galleryCount = 0;
    for (const item of mysqlGalleries as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO gallery (id, title, description, type, date, category, views, duration, thumbnail, media_url, published_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          id,
          item.title,
          item.description || 'Registo fotográfico da ANPERE',
          item.type || 'image',
          item.date || new Date().toISOString().split('T')[0],
          item.category || 'Geral',
          item.views || 0,
          item.duration,
          item.thumbnail,
          item.media_url,
          item.published_at || new Date(),
          item.updated_at || new Date()
        ]);
        galleryCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar gallery item: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${galleryCount} items de galeria migrados\n`);

    // =========================================
    // 3. MIGRAR SLIDESHOWS
    // =========================================
    console.log('📋 Migrando slideshows...');
    const [mysqlSlideshows] = await mysqlConn.query('SELECT * FROM slideshows');
    let slideshowCount = 0;
    for (const item of mysqlSlideshows as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO slideshow (id, title, subtitle, description, image_url, "order", is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          id,
          item.title || 'Slide ANPERE',
          item.subtitle,
          item.subtitle || item.title || 'ANPERE',
          item.image_url,
          item.order_index || 0,
          item.active ?? true,
          item.created_at || new Date(),
          item.updated_at || new Date()
        ]);
        slideshowCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar slideshow: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${slideshowCount} slides migrados\n`);

    // =========================================
    // 4. MIGRAR LEGISLATIONS
    // =========================================
    console.log('📋 Migrando legislations...');
    const [mysqlLegislations] = await mysqlConn.query('SELECT * FROM legislations');
    let legislationCount = 0;
    for (const item of mysqlLegislations as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO legislation (id, title, description, category, year, icon, content, file_url, published_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          id,
          item.title,
          item.description || '',
          item.category || 'Estatuto',
          item.year || new Date().getFullYear().toString(),
          item.icon || 'FileText',
          null,
          item.file_url,
          item.published_at || new Date(),
          item.updated_at || new Date()
        ]);
        legislationCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar legislation: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${legislationCount} legislações migradas\n`);

    // =========================================
    // 5. MIGRAR REPORTS
    // =========================================
    console.log('📋 Migrando reports...');
    const [mysqlReports] = await mysqlConn.query('SELECT * FROM reports');
    let reportCount = 0;
    for (const item of mysqlReports as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO reports (id, title, description, type, status, period, file_url, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          id,
          item.title,
          item.description || '',
          item.type || 'annual',
          item.status || 'published',
          item.period || new Date().getFullYear().toString(),
          item.file_url,
          item.created_at || new Date(),
          item.updated_at || new Date()
        ]);
        reportCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar report: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${reportCount} relatórios migrados\n`);

    // =========================================
    // 6. MIGRAR ACTIVITY PLANS
    // =========================================
    console.log('📋 Migrando activity_plans...');
    const [mysqlActivityPlans] = await mysqlConn.query('SELECT * FROM activity_plans');
    const planIdMap: { [key: number]: string } = {};
    let planCount = 0;
    
    for (const plan of mysqlActivityPlans as any[]) {
      const id = randomUUID();
      planIdMap[plan.id] = id;
      try {
        await pgClient.query(`
          INSERT INTO activity_plan (id, year, title, description, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          id,
          plan.year,
          plan.title || 'Plano de Atividades',
          plan.description,
          plan.is_active ?? true,
          plan.created_at || new Date(),
          plan.updated_at || new Date()
        ]);
        planCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar activity_plan: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${planCount} planos de atividades migrados\n`);

    // =========================================
    // 7. MIGRAR ACTIVITY PLAN ITEMS
    // =========================================
    console.log('📋 Migrando activity_plan_items...');
    const [mysqlActivityPlanItems] = await mysqlConn.query('SELECT * FROM activity_plan_items');
    let itemCount = 0;
    
    for (const item of mysqlActivityPlanItems as any[]) {
      const id = randomUUID();
      const planId = planIdMap[item.activity_plan_id];
      if (!planId) {
        console.log(`  ⚠️ Plan ID ${item.activity_plan_id} não encontrado`);
        continue;
      }
      try {
        await pgClient.query(`
          INSERT INTO activity_plan_items (id, plan_id, number, activity, date, time, location, participants, "order", parent_id, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          id,
          planId,
          item.number || 0,
          item.activity,
          item.date,
          item.time,
          item.location,
          item.participants,
          item.order_index || 0,
          null,
          item.created_at || new Date(),
          item.updated_at || new Date()
        ]);
        itemCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar activity_plan_item: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${itemCount} items de plano migrados\n`);

    // =========================================
    // 8. MIGRAR MEMBERS (se existirem)
    // =========================================
    console.log('📋 Migrando members...');
    const [mysqlMembers] = await mysqlConn.query('SELECT * FROM members');
    let memberCount = 0;
    for (const member of mysqlMembers as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO members (id, member_number, full_name, birth_date, birth_place, nationality, gender, marital_status, id_document, id_issue_date, id_issue_place, father_name, mother_name, occupation, phone, current_address, municipality, work_province, email, photo_url, other_info, status, registration_date, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        `, [
          id,
          member.member_number,
          member.full_name,
          member.birth_date,
          member.birth_place || '',
          member.nationality || 'Angolana',
          member.gender || 'Masculino',
          member.marital_status || 'Solteiro(a)',
          member.id_document || '',
          member.id_issue_date || '',
          member.id_issue_place || '',
          member.father_name || '',
          member.mother_name || '',
          member.occupation || '',
          member.phone || '',
          member.current_address || '',
          member.municipality || '',
          member.work_province || '',
          member.email || '',
          member.photo_url,
          member.other_info,
          member.status || 'pending',
          member.registration_date || new Date(),
          member.created_at || new Date(),
          member.updated_at || new Date()
        ]);
        memberCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar member: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${memberCount} membros migrados\n`);

    // =========================================
    // 9. MIGRAR SOCIAL ORGAOS
    // =========================================
    console.log('📋 Migrando social_orgaos...');
    const [mysqlOrgaos] = await mysqlConn.query('SELECT * FROM social_orgaos');
    let orgaoCount = 0;
    for (const orgao of mysqlOrgaos as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO orgaos_sociais (id, name, position, organ_type, bio, photo_url, email, phone, order_index, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          id,
          orgao.name,
          orgao.position,
          orgao.organ_type || 'Direcção',
          orgao.bio,
          orgao.photo_url,
          orgao.email,
          orgao.phone,
          orgao.order_index || 0,
          orgao.active ?? true,
          orgao.created_at || new Date(),
          orgao.updated_at || new Date()
        ]);
        orgaoCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar orgao social: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${orgaoCount} órgãos sociais migrados\n`);

    // =========================================
    // 10. MIGRAR EVENTS
    // =========================================
    console.log('📋 Migrando events...');
    const [mysqlEvents] = await mysqlConn.query('SELECT * FROM events');
    let eventCount = 0;
    for (const event of mysqlEvents as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO events (id, title, description, date, time, location, type, capacity, registration_url, published_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          id,
          event.title,
          event.description || '',
          event.date || new Date().toISOString().split('T')[0],
          event.time || '09:00',
          event.location || 'A definir',
          event.type || 'Evento',
          event.capacity,
          event.registration_url,
          event.published_at || new Date(),
          event.updated_at || new Date()
        ]);
        eventCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar event: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${eventCount} eventos migrados\n`);

    // =========================================
    // 11. MIGRAR CONTACT MESSAGES
    // =========================================
    console.log('📋 Migrando contact_messages...');
    const [mysqlMessages] = await mysqlConn.query('SELECT * FROM contact_messages');
    let messageCount = 0;
    for (const msg of mysqlMessages as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO contact_messages (id, name, email, phone, subject, message, is_read, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          id,
          msg.name,
          msg.email,
          null,
          msg.subject || 'Contato',
          msg.message,
          msg.status === 'read',
          msg.created_at || new Date(),
          msg.updated_at || new Date()
        ]);
        messageCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar contact message: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${messageCount} mensagens de contato migradas\n`);

    // =========================================
    // 12. MIGRAR PUBLICATIONS
    // =========================================
    console.log('📋 Migrando publications...');
    const [mysqlPublications] = await mysqlConn.query('SELECT * FROM publications');
    let pubCount = 0;
    for (const pub of mysqlPublications as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO publications (id, title, description, category, date, file_url, download_url, published_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          id,
          pub.title,
          pub.description || '',
          pub.category || 'Documento',
          pub.date || new Date().toISOString().split('T')[0],
          pub.file_url,
          pub.download_url,
          pub.published_at || new Date(),
          pub.updated_at || new Date()
        ]);
        pubCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar publication: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${pubCount} publicações migradas\n`);

    // =========================================
    // 13. MIGRAR TIMELINE EVENTS
    // =========================================
    console.log('📋 Migrando timeline_events...');
    const [mysqlTimeline] = await mysqlConn.query('SELECT * FROM timeline_events');
    let timelineCount = 0;
    for (const event of mysqlTimeline as any[]) {
      const id = randomUUID();
      try {
        await pgClient.query(`
          INSERT INTO timeline_events (id, year, event, description, details, image_url, "order", is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          id,
          event.year,
          event.event,
          event.description,
          event.details,
          event.image_url,
          event.order_index || 0,
          event.is_active ?? true,
          event.created_at || new Date(),
          event.updated_at || new Date()
        ]);
        timelineCount++;
      } catch (e) {
        console.log(`  ⚠️ Erro ao migrar timeline event: ${(e as Error).message}`);
      }
    }
    console.log(`  ✅ ${timelineCount} eventos da timeline migrados\n`);

    console.log('═══════════════════════════════════════════');
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('═══════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    pgClient.release();
    await pgPool.end();
    await mysqlConn.end();
    console.log('\n🔌 Conexões encerradas');
  }
}

migrate().catch(console.error);
