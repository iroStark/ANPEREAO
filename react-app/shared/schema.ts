import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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

// Timeline Events (History Events)
export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id", { length: 36 }).primaryKey(),
  year: varchar("year", { length: 10 }).notNull(),
  event: text("event").notNull(),
  description: text("description").notNull(),
  details: text("details"), // Detalhes expandidos para o modal
  imageUrl: text("image_url"), // URL da imagem opcional
  order: integer("order").default(0), // Ordem de exibição
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

// Legislation Items
export const legislation = pgTable("legislation", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'Lei Principal', 'Regulamento', 'Código', 'Decreto', 'Estatuto'
  year: varchar("year", { length: 4 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // lucide icon name
  content: text("content"), // Conteúdo HTML/texto para visualização visual
  fileUrl: text("file_url"), // URL do arquivo PDF (opcional)
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  id: varchar("id", { length: 36 }).primaryKey(),
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
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'active', 'inactive', 'pending'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  memberNumber: true,
  registrationDate: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  gender: z.enum(["Masculino", "Feminino"], { 
    required_error: "Selecione o sexo",
  }),
  maritalStatus: z.enum(["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"], {
    required_error: "Selecione o estado civil",
  }),
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// Slideshow Slides
export const slideshow = pgTable("slideshow", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(), // URL to the slide image
  order: integer("order").notNull().default(0), // Order of display
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSlideshowSchema = createInsertSchema(slideshow).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSlideshow = z.infer<typeof insertSlideshowSchema>;
export type Slideshow = typeof slideshow.$inferSelect;

// Activity Plan (Plano de Atividades)
export const activityPlan = pgTable("activity_plan", {
  id: varchar("id", { length: 36 }).primaryKey(),
  year: varchar("year", { length: 4 }).notNull(), // '2025'
  title: text("title").notNull().default("Plano de Atividades"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertActivityPlanSchema = createInsertSchema(activityPlan).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertActivityPlan = z.infer<typeof insertActivityPlanSchema>;
export type ActivityPlan = typeof activityPlan.$inferSelect;

// Activity Plan Items (Atividades do plano)
export const activityPlanItems = pgTable("activity_plan_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  planId: varchar("plan_id", { length: 36 }).notNull().references(() => activityPlan.id, { onDelete: 'cascade' }),
  number: integer("number").notNull(), // Número da atividade
  activity: text("activity").notNull(), // Nome da atividade
  date: text("date"), // Data ou período (ex: "Janeiro a Dezembro", "Trimestralmente")
  time: text("time"), // Hora ou período de tempo
  location: text("location"), // Local da atividade
  participants: text("participants"), // Participantes
  order: integer("order").notNull().default(0), // Ordem de exibição
  parentId: varchar("parent_id", { length: 36 }), // Para sub-atividades (referência ao item pai)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertActivityPlanItemSchema = createInsertSchema(activityPlanItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertActivityPlanItem = z.infer<typeof insertActivityPlanItemSchema>;
export type ActivityPlanItem = typeof activityPlanItems.$inferSelect;

// Contact Messages (Mensagens de contato)
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Órgãos Sociais (Social Organs)
export const orgaosSociais = pgTable("orgaos_sociais", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  organType: varchar("organ_type", { length: 50 }).notNull(), // 'Assembleia Geral', 'Direcção', 'Conselho Fiscal'
  bio: text("bio"),
  photoUrl: text("photo_url"),
  email: text("email"),
  phone: varchar("phone", { length: 20 }),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrgaoSocialSchema = createInsertSchema(orgaosSociais).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrgaoSocial = z.infer<typeof insertOrgaoSocialSchema>;
export type OrgaoSocial = typeof orgaosSociais.$inferSelect;

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'member_registration', 'contact_message', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"), // URL para a página relacionada
  isRead: boolean("is_read").default(false),
  relatedId: varchar("related_id", { length: 255 }), // ID do membro, mensagem, etc.
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
