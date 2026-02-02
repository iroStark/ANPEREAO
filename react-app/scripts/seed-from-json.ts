
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";

// Create DB connection
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = drizzle(pool, { mode: 'default', schema, logger: true });

async function readJson(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not read ${filename}:`, error);
    return [];
  }
}

async function seed() {
  console.log("🌱 Starting seed from JSON files...");

  // Disable FK checks to allow truncation
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

  // Clear existing data
  console.log("Cleaning tables...");
  
  // Use try-catch for deletions in case tables don't exist yet (though unlikely after db:push)
  try {
      await db.delete(schema.users);
      await db.delete(schema.aboutContent);
      await db.delete(schema.legislation);
      await db.delete(schema.publications);
      await db.delete(schema.events);
      await db.delete(schema.gallery);
      await db.delete(schema.slideshow);
      await db.delete(schema.activityPlanItems);
      await db.delete(schema.activityPlan);
      await db.delete(schema.members);
      await db.delete(schema.reports);
      await db.delete(schema.contactMessages);
      await db.delete(schema.orgaosSociais);
      await db.delete(schema.notifications);
      await db.delete(schema.settings);
  } catch (e) {
      console.error("Error clearing tables:", e);
  }

  // Re-enable FK checks
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);


  // Import Users
  const users = await readJson("users.json");
  if (users.length) {
    console.log(`Importing ${users.length} users...`);
    await db.insert(schema.users).values(users.map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
      lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null
    })));
  }

  // Import About Content
  const about = await readJson("aboutContent.json");
  if (about.length) {
    console.log(`Importing ${about.length} about content items...`);
    await db.insert(schema.aboutContent).values(about.map((i: any) => ({
      ...i,
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Legislation
  const legislation = await readJson("legislation.json");
  if (legislation.length) {
    console.log(`Importing ${legislation.length} legislation items...`);
    await db.insert(schema.legislation).values(legislation.map((i: any) => ({
      ...i,
      publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Publications
  const publications = await readJson("publications.json");
  if (publications.length) {
    console.log(`Importing ${publications.length} publications...`);
    await db.insert(schema.publications).values(publications.map((i: any) => ({
      ...i,
      publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Events
  const events = await readJson("events.json");
  if (events.length) {
    console.log(`Importing ${events.length} events...`);
    await db.insert(schema.events).values(events.map((i: any) => ({
      ...i,
      publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Gallery
  const gallery = await readJson("gallery.json");
  if (gallery.length) {
    console.log(`Importing ${gallery.length} gallery items...`);
    await db.insert(schema.gallery).values(gallery.map((i: any) => ({
      ...i,
      publishedAt: i.publishedAt ? new Date(i.publishedAt) : null,
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Slideshow
  const slideshow = await readJson("slideshow.json");
  if (slideshow.length) {
    console.log(`Importing ${slideshow.length} slideshow items...`);
    await db.insert(schema.slideshow).values(slideshow.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Activity Plans
  const plans = await readJson("activityPlans.json");
  if (plans.length) {
    console.log(`Importing ${plans.length} activity plans...`);
    await db.insert(schema.activityPlan).values(plans.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Activity Plan Items
  const planItems = await readJson("activityPlanItems.json");
  if (planItems.length) {
    console.log(`Importing ${planItems.length} activity plan items...`);
    await db.insert(schema.activityPlanItems).values(planItems.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Members
  const members = await readJson("members.json");
  if (members.length) {
    console.log(`Importing ${members.length} members...`);
    await db.insert(schema.members).values(members.map((i: any) => ({
      ...i,
      registrationDate: i.registrationDate ? new Date(i.registrationDate) : null,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Reports
  const reports = await readJson("reports.json");
  if (reports.length) {
    console.log(`Importing ${reports.length} reports...`);
    await db.insert(schema.reports).values(reports.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Contact Messages
  const messages = await readJson("contactMessages.json");
  if (messages.length) {
    console.log(`Importing ${messages.length} contact messages...`);
    await db.insert(schema.contactMessages).values(messages.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  // Import Settings
  const settings = await readJson("settings.json");
  if (settings.length) {
    console.log(`Importing ${settings.length} settings...`);
    await db.insert(schema.settings).values(settings.map((i: any) => ({
      ...i,
      createdAt: new Date(i.createdAt),
      updatedAt: new Date(i.updatedAt)
    })));
  }

  console.log("✅ Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
