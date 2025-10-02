import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default('viewer'), // 'admin', 'editor', 'viewer'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  fileUrl: text("file_url"), // URL to the document file
  downloadUrl: text("download_url"), // URL for downloading the file
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
  type: varchar("type", { length: 50 }).notNull(), // 'Conferência', 'Workshop', etc.
  capacity: varchar("capacity", { length: 20 }), // participant count/limit
  registrationUrl: text("registration_url"), // URL for registration
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

// Reports
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'monthly', 'quarterly', 'annual', 'special'
  status: varchar("status", { length: 20 }).notNull().default('draft'), // 'draft', 'published', 'archived'
  period: varchar("period", { length: 50 }).notNull(), // formatted period string
  fileUrl: text("file_url"), // URL to the report file
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Settings
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 20 }).notNull(), // 'general', 'email', 'security', 'database', 'website'
  type: varchar("type", { length: 20 }).notNull(), // 'string', 'number', 'boolean', 'json'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

// Members (Associados)
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberNumber: varchar("member_number", { length: 20 }), // Número de membro
  fullName: text("full_name").notNull(),
  birthDate: varchar("birth_date", { length: 50 }).notNull(),
  birthPlace: text("birth_place").notNull(), // Naturalidade
  nationality: varchar("nationality", { length: 50 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(), // Sexo
  maritalStatus: varchar("marital_status", { length: 20 }).notNull(), // Estado Civil
  idDocument: varchar("id_document", { length: 50 }).notNull(), // B.I./Passaporte
  idIssueDate: varchar("id_issue_date", { length: 50 }).notNull(),
  idIssuePlace: text("id_issue_place").notNull(),
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  occupation: text("occupation").notNull(), // Função que Exerce/exerceu
  phone: varchar("phone", { length: 20 }).notNull(),
  currentAddress: text("current_address").notNull(), // Residência Actual
  municipality: text("municipality").notNull(), // Município e Distrito
  workProvince: text("work_province").notNull(), // Província onde Trabalhou
  email: text("email").notNull(),
  photoUrl: text("photo_url"), // URL da foto
  otherInfo: text("other_info"), // Outros dados
  registrationDate: timestamp("registration_date").defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default('active'), // 'active', 'inactive', 'pending'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  memberNumber: true,
  registrationDate: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
