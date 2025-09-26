import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// About Section Content
export const aboutContent = pgTable("about_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: varchar("section", { length: 50 }).notNull(), // 'mission', 'vision', 'values', 'history'
  title: text("title").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;

// Legislation Items
export const legislation = pgTable("legislation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'Lei Principal', 'Regulamento', 'Código', 'Decreto'
  year: varchar("year", { length: 4 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // lucide icon name
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLegislationSchema = createInsertSchema(legislation).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertLegislation = z.infer<typeof insertLegislationSchema>;
export type Legislation = typeof legislation.$inferSelect;

// Publications
export const publications = pgTable("publications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'Plano', 'Relatório', 'Acta', etc.
  date: varchar("date", { length: 50 }).notNull(), // formatted date string
  size: varchar("size", { length: 20 }).notNull(), // file size string
  downloads: integer("downloads").default(0),
  fileUrl: text("file_url"), // URL to the document file
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPublicationSchema = createInsertSchema(publications).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Publication = typeof publications.$inferSelect;

// Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: varchar("date", { length: 50 }).notNull(), // formatted date string
  time: varchar("time", { length: 50 }).notNull(), // time range string
  location: text("location").notNull(),
  participants: varchar("participants", { length: 20 }).notNull(), // participant count/limit
  status: varchar("status", { length: 20 }).notNull().default('upcoming'), // 'upcoming', 'completed', 'cancelled'
  category: varchar("category", { length: 50 }).notNull(), // 'Conferência', 'Workshop', etc.
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Gallery Items
export const gallery = pgTable("gallery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'image', 'video'
  date: varchar("date", { length: 50 }).notNull(), // formatted date string
  category: varchar("category", { length: 50 }).notNull(), // 'Evento', 'Palestra', etc.
  views: integer("views").default(0),
  duration: varchar("duration", { length: 20 }), // for videos only
  thumbnail: text("thumbnail"), // URL to thumbnail image
  mediaUrl: text("media_url"), // URL to actual media file
  publishedAt: timestamp("published_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  publishedAt: true,
  updatedAt: true,
});

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;
