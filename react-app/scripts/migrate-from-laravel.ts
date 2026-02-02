/**
 * Script de migração de dados do Laravel para Node.js/Drizzle
 * Converte IDs bigint auto-increment para UUIDs
 */

import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

// Mapeamento de IDs antigos (bigint) para novos UUIDs
const idMap: Record<string, Record<number, string>> = {
  users: {},
  about_contents: {},
  timeline_events: {},
  legislation: {},
  publications: {},
  events: {},
  gallery: {},
  reports: {},
  settings: {},
  members: {},
  slideshow: {},
  activity_plan: {},
  activity_plan_items: {},
  orgaos_sociais: {},
  contact_messages: {},
  notifications: {},
};

interface LaravelRow {
  [key: string]: any;
}

function generateOrGetUUID(table: string, oldId: number): string {
  if (!idMap[table][oldId]) {
    idMap[table][oldId] = randomUUID();
  }
  return idMap[table][oldId];
}

async function migrate() {
  const sourceDb = await mysql.createConnection({
    host: process.env.SOURCE_DB_HOST || 'localhost',
    port: parseInt(process.env.SOURCE_DB_PORT || '3306'),
    user: process.env.SOURCE_DB_USER || 'root',
    password: process.env.SOURCE_DB_PASSWORD || '',
    database: process.env.SOURCE_DB_NAME || 'anpere_laravel',
  });

  const targetDb = await mysql.createConnection({
    host: process.env.TARGET_DB_HOST || 'localhost',
    port: parseInt(process.env.TARGET_DB_PORT || '3306'),
    user: process.env.TARGET_DB_USER || 'root',
    password: process.env.TARGET_DB_PASSWORD || '',
    database: process.env.TARGET_DB_NAME || 'anpere_nodejs',
  });

  console.log('🔗 Conectado aos bancos de dados');

  try {
    // 1. Migrar Users
    console.log('\n👤 Migrando usuários...');
    const [users] = await sourceDb.execute('SELECT * FROM users');
    for (const user of users as LaravelRow[]) {
      const newId = generateOrGetUUID('users', user.id);
      await targetDb.execute(
        `INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at, last_login_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         username = VALUES(username), email = VALUES(email), role = VALUES(role), 
         is_active = VALUES(is_active), last_login_at = VALUES(last_login_at)`,
        [
          newId,
          user.username || user.email?.split('@')[0] || `user_${user.id}`,
          user.email,
          user.password, // Mantém o hash do Laravel (bcrypt compatível)
          user.role || 'admin',
          user.is_active ?? true,
          user.created_at,
          user.updated_at,
          user.last_login_at,
        ]
      );
    }
    console.log(`   ✅ ${(users as LaravelRow[]).length} usuários migrados`);

    // 2. Migrar About Contents
    console.log('\n📄 Migrando conteúdos sobre...');
    const [aboutContents] = await sourceDb.execute('SELECT * FROM about_contents');
    for (const content of aboutContents as LaravelRow[]) {
      const newId = generateOrGetUUID('about_contents', content.id);
      await targetDb.execute(
        `INSERT INTO about_content (id, section, title, content, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
        [newId, content.section, content.title, content.content, content.updated_at]
      );
    }
    console.log(`   ✅ ${(aboutContents as LaravelRow[]).length} conteúdos migrados`);

    // 3. Migrar Timeline Events
    console.log('\n📅 Migrando eventos da timeline...');
    const [timelineEvents] = await sourceDb.execute('SELECT * FROM timeline_events');
    for (const event of timelineEvents as LaravelRow[]) {
      const newId = generateOrGetUUID('timeline_events', event.id);
      await targetDb.execute(
        `INSERT INTO timeline_events (id, year, event, description, details, image_url, \`order\`, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE event = VALUES(event), description = VALUES(description)`,
        [
          newId,
          event.year,
          event.event,
          event.description,
          event.details,
          event.image_url,
          event.order_index || event.order || 0,
          event.is_active ?? event.active ?? true,
          event.created_at,
          event.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(timelineEvents as LaravelRow[]).length} eventos migrados`);

    // 4. Migrar Legislation
    console.log('\n📜 Migrando legislações...');
    const [legislations] = await sourceDb.execute('SELECT * FROM legislations');
    for (const leg of legislations as LaravelRow[]) {
      const newId = generateOrGetUUID('legislation', leg.id);
      await targetDb.execute(
        `INSERT INTO legislation (id, title, description, category, year, icon, content, file_url, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          leg.title,
          leg.description,
          leg.category,
          leg.year,
          leg.icon || 'BookOpen',
          leg.content,
          leg.file_url,
          leg.published_at,
          leg.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(legislations as LaravelRow[]).length} legislações migradas`);

    // 5. Migrar Publications
    console.log('\n📚 Migrando publicações...');
    const [publications] = await sourceDb.execute('SELECT * FROM publications');
    for (const pub of publications as LaravelRow[]) {
      const newId = generateOrGetUUID('publications', pub.id);
      await targetDb.execute(
        `INSERT INTO publications (id, title, description, category, date, file_url, download_url, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          pub.title,
          pub.description,
          pub.category,
          pub.date,
          pub.file_url,
          pub.download_url,
          pub.published_at,
          pub.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(publications as LaravelRow[]).length} publicações migradas`);

    // 6. Migrar Events
    console.log('\n🎉 Migrando eventos...');
    const [events] = await sourceDb.execute('SELECT * FROM events');
    for (const event of events as LaravelRow[]) {
      const newId = generateOrGetUUID('events', event.id);
      await targetDb.execute(
        `INSERT INTO events (id, title, description, date, time, location, type, capacity, registration_url, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          event.title,
          event.description,
          event.date,
          event.time,
          event.location,
          event.type,
          event.capacity,
          event.registration_url,
          event.published_at,
          event.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(events as LaravelRow[]).length} eventos migrados`);

    // 7. Migrar Gallery
    console.log('\n🖼️  Migrando galeria...');
    const [galleries] = await sourceDb.execute('SELECT * FROM galleries');
    for (const item of galleries as LaravelRow[]) {
      const newId = generateOrGetUUID('gallery', item.id);
      await targetDb.execute(
        `INSERT INTO gallery (id, title, description, type, date, category, views, duration, thumbnail, media_url, published_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          item.title,
          item.description,
          item.type || 'image',
          item.date,
          item.category || 'Geral',
          item.views || 0,
          item.duration,
          item.thumbnail,
          item.media_url,
          item.published_at,
          item.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(galleries as LaravelRow[]).length} itens de galeria migrados`);

    // 8. Migrar Reports
    console.log('\n📊 Migrando relatórios...');
    const [reports] = await sourceDb.execute('SELECT * FROM reports');
    for (const report of reports as LaravelRow[]) {
      const newId = generateOrGetUUID('reports', report.id);
      await targetDb.execute(
        `INSERT INTO reports (id, title, description, type, status, period, file_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          report.title,
          report.description,
          report.type,
          report.status || 'draft',
          report.period,
          report.file_url,
          report.created_at,
          report.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(reports as LaravelRow[]).length} relatórios migrados`);

    // 9. Migrar Members
    console.log('\n👥 Migrando membros...');
    const [members] = await sourceDb.execute('SELECT * FROM members');
    for (const member of members as LaravelRow[]) {
      const newId = generateOrGetUUID('members', member.id);
      await targetDb.execute(
        `INSERT INTO members (id, member_number, full_name, birth_date, birth_place, nationality, gender, marital_status, 
         id_document, id_issue_date, id_issue_place, father_name, mother_name, occupation, phone, current_address, 
         municipality, work_province, email, photo_url, other_info, registration_date, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), email = VALUES(email)`,
        [
          newId,
          member.member_number,
          member.full_name,
          member.birth_date,
          member.birth_place,
          member.nationality,
          member.gender,
          member.marital_status,
          member.id_document,
          member.id_issue_date,
          member.id_issue_place,
          member.father_name,
          member.mother_name,
          member.occupation,
          member.phone,
          member.current_address,
          member.municipality,
          member.work_province,
          member.email,
          member.photo_url,
          member.other_info,
          member.registration_date,
          member.status || 'pending',
          member.created_at,
          member.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(members as LaravelRow[]).length} membros migrados`);

    // 10. Migrar Slideshow
    console.log('\n🎞️  Migrando slideshow...');
    const [slideshows] = await sourceDb.execute('SELECT * FROM slideshows');
    for (const slide of slideshows as LaravelRow[]) {
      const newId = generateOrGetUUID('slideshow', slide.id);
      await targetDb.execute(
        `INSERT INTO slideshow (id, title, subtitle, description, image_url, \`order\`, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          slide.title,
          slide.subtitle,
          slide.description || slide.title,
          slide.image_url,
          slide.order_index || slide.order || 0,
          slide.active ?? slide.is_active ?? true,
          slide.created_at,
          slide.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(slideshows as LaravelRow[]).length} slides migrados`);

    // 11. Migrar Activity Plans
    console.log('\n📋 Migrando planos de atividades...');
    const [activityPlans] = await sourceDb.execute('SELECT * FROM activity_plans');
    for (const plan of activityPlans as LaravelRow[]) {
      const newId = generateOrGetUUID('activity_plan', plan.id);
      await targetDb.execute(
        `INSERT INTO activity_plan (id, year, title, description, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
        [
          newId,
          plan.year,
          plan.title,
          plan.description,
          plan.is_active ?? true,
          plan.created_at,
          plan.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(activityPlans as LaravelRow[]).length} planos migrados`);

    // 12. Migrar Activity Plan Items
    console.log('\n📋 Migrando itens do plano de atividades...');
    const [activityPlanItems] = await sourceDb.execute('SELECT * FROM activity_plan_items');
    for (const item of activityPlanItems as LaravelRow[]) {
      const newId = generateOrGetUUID('activity_plan_items', item.id);
      const planNewId = item.activity_plan_id ? generateOrGetUUID('activity_plan', item.activity_plan_id) : null;
      
      await targetDb.execute(
        `INSERT INTO activity_plan_items (id, plan_id, number, activity, date, time, location, participants, \`order\`, parent_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE activity = VALUES(activity), date = VALUES(date)`,
        [
          newId,
          planNewId,
          item.number,
          item.activity,
          item.date,
          item.time,
          item.location,
          item.participants,
          item.order_index || item.order || 0,
          item.parent_id,
          item.created_at,
          item.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(activityPlanItems as LaravelRow[]).length} itens migrados`);

    // 13. Migrar Social Organs (Órgãos Sociais)
    console.log('\n🏛️  Migrando órgãos sociais...');
    const [orgaos] = await sourceDb.execute('SELECT * FROM social_orgaos');
    for (const orgao of orgaos as LaravelRow[]) {
      const newId = generateOrGetUUID('orgaos_sociais', orgao.id);
      await targetDb.execute(
        `INSERT INTO orgaos_sociais (id, name, position, organ_type, bio, photo_url, email, phone, order_index, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), position = VALUES(position)`,
        [
          newId,
          orgao.name,
          orgao.position,
          orgao.organ_type,
          orgao.bio,
          orgao.photo_url,
          orgao.email,
          orgao.phone,
          orgao.order_index || 0,
          orgao.active ?? orgao.is_active ?? true,
          orgao.created_at,
          orgao.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(orgaos as LaravelRow[]).length} órgãos sociais migrados`);

    // 14. Migrar Contact Messages
    console.log('\n📧 Migrando mensagens de contato...');
    const [contactMessages] = await sourceDb.execute('SELECT * FROM contact_messages');
    for (const msg of contactMessages as LaravelRow[]) {
      const newId = generateOrGetUUID('contact_messages', msg.id);
      await targetDb.execute(
        `INSERT INTO contact_messages (id, name, email, phone, subject, message, is_read, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), subject = VALUES(subject)`,
        [
          newId,
          msg.name,
          msg.email,
          msg.phone,
          msg.subject,
          msg.message,
          msg.status === 'read' || msg.is_read || false,
          msg.date || msg.created_at,
          msg.updated_at,
        ]
      );
    }
    console.log(`   ✅ ${(contactMessages as LaravelRow[]).length} mensagens migradas`);

    // 15. Migrar Notifications
    console.log('\n🔔 Migrando notificações...');
    const [notifications] = await sourceDb.execute('SELECT * FROM notifications');
    for (const notif of notifications as LaravelRow[]) {
      const newId = generateOrGetUUID('notifications', notif.id);
      const userNewId = notif.user_id ? generateOrGetUUID('users', notif.user_id) : null;
      
      await targetDb.execute(
        `INSERT INTO notifications (id, type, title, message, link, is_read, related_id, created_at, read_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), message = VALUES(message)`,
        [
          newId,
          notif.type || 'info',
          notif.title,
          notif.message,
          notif.link,
          notif.read || notif.is_read || false,
          notif.related_id,
          notif.created_at,
          notif.read_at,
        ]
      );
    }
    console.log(`   ✅ ${(notifications as LaravelRow[]).length} notificações migradas`);

    console.log('\n✅✅✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO! ✅✅✅\n');
    
    // Salvar mapeamento de IDs para referência futura
    console.log('📝 Resumo do mapeamento de IDs:');
    for (const [table, mapping] of Object.entries(idMap)) {
      const count = Object.keys(mapping).length;
      if (count > 0) {
        console.log(`   ${table}: ${count} registros`);
      }
    }

  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await sourceDb.end();
    await targetDb.end();
  }
}

// Executar migração
migrate().catch(console.error);
