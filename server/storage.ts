/**
 * Storage implementation using PostgreSQL
 */

import { 
  type User, type InsertUser,
  type AboutContent, type InsertAboutContent,
  type Legislation, type InsertLegislation,
  type Publication, type InsertPublication,
  type Event, type InsertEvent,
  type Gallery, type InsertGallery,
  type Report, type InsertReport,
  type Setting, type InsertSetting,
  type Member, type InsertMember,
  type Slideshow, type InsertSlideshow,
  type ActivityPlan, type InsertActivityPlan,
  type ActivityPlanItem, type InsertActivityPlanItem,
  type OrgaoSocial, type InsertOrgaoSocial,
  type ContactMessage, type InsertContactMessage,
  type TimelineEvent, type InsertTimelineEvent,
  type Notification, type InsertNotification,
  users, aboutContent, legislation, publications, events,
  gallery, reports, settings, members, slideshow,
  activityPlan, activityPlanItems, orgaosSociais,
  contactMessages, timelineEvents, notifications
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, asc, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // About Content operations
  getAboutContent(): Promise<AboutContent[]>;
  getAboutContentBySection(section: string): Promise<AboutContent | undefined>;
  createAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  updateAboutContent(id: string, content: Partial<InsertAboutContent>): Promise<AboutContent | undefined>;
  deleteAboutContent(id: string): Promise<boolean>;

  // Timeline Events operations
  getAllTimelineEvents(): Promise<TimelineEvent[]>;
  getTimelineEvent(id: string): Promise<TimelineEvent | undefined>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: string, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: string): Promise<boolean>;

  // Notifications operations
  getAllNotifications(): Promise<Notification[]>;
  getUnreadNotificationsCount(): Promise<number>;
  getNotification(id: string): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsAsRead(): Promise<boolean>;
  deleteNotification(id: string): Promise<boolean>;

  // Legislation operations
  getAllLegislation(): Promise<Legislation[]>;
  getLegislation(id: string): Promise<Legislation | undefined>;
  createLegislation(legislation: InsertLegislation): Promise<Legislation>;
  updateLegislation(id: string, legislation: Partial<InsertLegislation>): Promise<Legislation | undefined>;
  deleteLegislation(id: string): Promise<boolean>;

  // Publication operations
  getAllPublications(): Promise<Publication[]>;
  getPublication(id: string): Promise<Publication | undefined>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  updatePublication(id: string, publication: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: string): Promise<boolean>;

  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Gallery operations
  getAllGallery(): Promise<Gallery[]>;
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: string, item: Partial<InsertGallery>): Promise<Gallery | undefined>;
  deleteGalleryItem(id: string): Promise<boolean>;

  // User management operations
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Report operations
  getAllReports(): Promise<Report[]>;
  getReport(id: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: string, report: Partial<InsertReport>): Promise<Report | undefined>;
  deleteReport(id: string): Promise<boolean>;

  // Setting operations
  getAllSettings(): Promise<Setting[]>;
  getSetting(id: string): Promise<Setting | undefined>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(id: string, setting: Partial<InsertSetting>): Promise<Setting | undefined>;
  deleteSetting(id: string): Promise<boolean>;

  // Member operations
  getAllMembers(): Promise<Member[]>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: string): Promise<boolean>;

  // Activity Plan operations
  getAllActivityPlans(): Promise<ActivityPlan[]>;
  getActivityPlan(id: string): Promise<(ActivityPlan & { items: ActivityPlanItem[] }) | undefined>;
  getActiveActivityPlan(): Promise<(ActivityPlan & { items: ActivityPlanItem[] }) | undefined>;
  createActivityPlan(plan: InsertActivityPlan): Promise<ActivityPlan>;
  updateActivityPlan(id: string, plan: Partial<InsertActivityPlan>): Promise<ActivityPlan | undefined>;
  deleteActivityPlan(id: string): Promise<boolean>;
  createActivityPlanItem(item: InsertActivityPlanItem): Promise<ActivityPlanItem>;
  updateActivityPlanItem(id: string, item: Partial<InsertActivityPlanItem>): Promise<ActivityPlanItem | undefined>;
  deleteActivityPlanItem(id: string): Promise<boolean>;
  getActivityPlanItems(planId: string): Promise<ActivityPlanItem[]>;

  // Slideshow operations
  getAllSlideshow(): Promise<Slideshow[]>;
  getSlideshow(id: string): Promise<Slideshow | undefined>;
  createSlideshow(item: InsertSlideshow): Promise<Slideshow>;
  updateSlideshow(id: string, item: Partial<InsertSlideshow>): Promise<Slideshow | undefined>;
  deleteSlideshow(id: string): Promise<boolean>;

  // Social Organs operations
  getAllOrgaosSociais(): Promise<OrgaoSocial[]>;
  getOrgaoSocial(id: string): Promise<OrgaoSocial | undefined>;
  getOrgaosSociaisByType(organType: string): Promise<OrgaoSocial[]>;
  createOrgaoSocial(orgao: InsertOrgaoSocial): Promise<OrgaoSocial>;
  updateOrgaoSocial(id: string, orgao: Partial<InsertOrgaoSocial>): Promise<OrgaoSocial | undefined>;
  deleteOrgaoSocial(id: string): Promise<boolean>;

  // Contact Messages operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Please set it in your .env file with your PostgreSQL connection string."
      );
    }
    
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool);
    this.initTables();
  }

  private async initTables() {
    // Tables are created via drizzle-kit push or migrations
    // Seed default data
    await this.seedDefaultData();
  }

  // Helper para verificar se operação de delete foi bem sucedida
  // PostgreSQL retorna rowCount, não length
  private wasDeleted(result: unknown): boolean {
    if (!result) return false;
    const r = result as any;
    return (r.rowCount !== undefined && r.rowCount > 0) || 
           (r.length !== undefined && r.length > 0) || 
           (r.count !== undefined && r.count > 0);
  }

  private async seedDefaultData() {
    const existingAdmin = await this.getUserByUsername('admin');
    if (!existingAdmin) {
      await this.createUser({
        username: 'admin',
        email: 'admin@anpere.ao',
        password: '$2b$10$WRzjAZWHGFqf7h2kPKC77.Gun/lvaN8wpPvoudRp0A3GUq/YXUCey', // admin123
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin user created');
    }

    // Seed slideshow if empty
    const slides = await this.getAllSlideshow();
    if (slides.length === 0) {
      await this.createSlideshow({
        title: 'Profissionais do Espectro Rádio Eletrónico',
        subtitle: 'Unindo especialistas em telecomunicações de Angola',
        description: 'ANPERE representa e apoia os profissionais do espectro rádio eletrónico.',
        imageUrl: '/attached_assets/generated_images/Angolan_telecommunications_professionals_working_640a21c0.png',
        order: 0,
        isActive: true,
      });
      await this.createSlideshow({
        title: 'Tecnologia e Inovação',
        subtitle: 'Avançando nas telecomunicações angolanas',
        description: 'Contribuímos para o desenvolvimento das telecomunicações em Angola.',
        imageUrl: '/attached_assets/generated_images/Telecommunications_tower_in_Luanda_Angola_da464df4.png',
        order: 1,
        isActive: true,
      });
      console.log('✅ Default slides created');
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = { 
      ...user, 
      id, 
      role: user.role || 'viewer',
      isActive: user.isActive ?? true,
      email: user.email || null,
      lastLoginAt: null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    await this.db.insert(users).values(newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    await this.db.update(users).set({ ...user, updatedAt: new Date() }).where(eq(users.id, id));
    return this.getUser(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return this.wasDeleted(result);
  }

  // About Content operations
  async getAboutContent(): Promise<AboutContent[]> {
    return await this.db.select().from(aboutContent);
  }

  async getAboutContentBySection(section: string): Promise<AboutContent | undefined> {
    const result = await this.db.select().from(aboutContent).where(eq(aboutContent.section, section));
    return result[0];
  }

  async createAboutContent(content: InsertAboutContent): Promise<AboutContent> {
    const id = randomUUID();
    const newContent: AboutContent = { ...content, id, updatedAt: new Date() };
    await this.db.insert(aboutContent).values(newContent);
    return newContent;
  }

  async updateAboutContent(id: string, content: Partial<InsertAboutContent>): Promise<AboutContent | undefined> {
    await this.db.update(aboutContent).set({ ...content, updatedAt: new Date() }).where(eq(aboutContent.id, id));
    return this.getAboutContentBySection(content.section || '') || this.db.select().from(aboutContent).where(eq(aboutContent.id, id)).then(res => res[0]);
  }

  async deleteAboutContent(id: string): Promise<boolean> {
    const result = await this.db.delete(aboutContent).where(eq(aboutContent.id, id));
    return this.wasDeleted(result);
  }

  // Timeline Events operations
  async getAllTimelineEvents(): Promise<TimelineEvent[]> {
    return await this.db.select().from(timelineEvents).where(eq(timelineEvents.isActive, true)).orderBy(asc(timelineEvents.order), desc(timelineEvents.year));
  }

  async getTimelineEvent(id: string): Promise<TimelineEvent | undefined> {
    const result = await this.db.select().from(timelineEvents).where(eq(timelineEvents.id, id));
    return result[0];
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = randomUUID();
    const newEvent: TimelineEvent = { 
      ...event, 
      id, 
      details: event.details || null,
      imageUrl: event.imageUrl || null,
      order: event.order ?? 0,
      isActive: event.isActive ?? true,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    await this.db.insert(timelineEvents).values(newEvent);
    return newEvent;
  }

  async updateTimelineEvent(id: string, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined> {
    await this.db.update(timelineEvents).set({ ...event, updatedAt: new Date() }).where(eq(timelineEvents.id, id));
    return this.getTimelineEvent(id);
  }

  async deleteTimelineEvent(id: string): Promise<boolean> {
    const result = await this.db.delete(timelineEvents).where(eq(timelineEvents.id, id));
    return this.wasDeleted(result);
  }

  // Notifications operations
  async getAllNotifications(): Promise<Notification[]> {
    return await this.db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsCount(): Promise<number> {
    const result = await this.db.select().from(notifications).where(eq(notifications.isRead, false));
    return result.length;
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    const result = await this.db.select().from(notifications).where(eq(notifications.id, id));
    return result[0];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const newNotification: Notification = { 
      ...notification, 
      id, 
      link: notification.link || null,
      relatedId: notification.relatedId || null,
      isRead: false,
      readAt: null,
      createdAt: new Date()
    };
    await this.db.insert(notifications).values(newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    await this.db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id));
    return this.getNotification(id);
  }

  async markAllNotificationsAsRead(): Promise<boolean> {
    await this.db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.isRead, false));
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.db.delete(notifications).where(eq(notifications.id, id));
    return this.wasDeleted(result);
  }

  // Legislation operations
  async getAllLegislation(): Promise<Legislation[]> {
    return await this.db.select().from(legislation);
  }

  async getLegislation(id: string): Promise<Legislation | undefined> {
    const result = await this.db.select().from(legislation).where(eq(legislation.id, id));
    return result[0];
  }

  async createLegislation(leg: InsertLegislation): Promise<Legislation> {
    const id = randomUUID();
    const newLegislation: Legislation = { 
      ...leg, 
      id, 
      content: leg.content || null,
      fileUrl: leg.fileUrl || null,
      publishedAt: new Date(), 
      updatedAt: new Date() 
    };
    await this.db.insert(legislation).values(newLegislation);
    return newLegislation;
  }

  async updateLegislation(id: string, leg: Partial<InsertLegislation>): Promise<Legislation | undefined> {
    await this.db.update(legislation).set({ ...leg, updatedAt: new Date() }).where(eq(legislation.id, id));
    return this.getLegislation(id);
  }

  async deleteLegislation(id: string): Promise<boolean> {
    const result = await this.db.delete(legislation).where(eq(legislation.id, id));
    return this.wasDeleted(result);
  }

  // Publication operations
  async getAllPublications(): Promise<Publication[]> {
    return await this.db.select().from(publications);
  }

  async getPublication(id: string): Promise<Publication | undefined> {
    const result = await this.db.select().from(publications).where(eq(publications.id, id));
    return result[0];
  }

  async createPublication(pub: InsertPublication): Promise<Publication> {
    const id = randomUUID();
    const newPublication: Publication = {
      ...pub,
      fileUrl: pub.fileUrl ?? null,
      downloadUrl: pub.downloadUrl ?? null,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.insert(publications).values(newPublication);
    return newPublication;
  }

  async updatePublication(id: string, pub: Partial<InsertPublication>): Promise<Publication | undefined> {
    await this.db.update(publications).set({ ...pub, updatedAt: new Date() }).where(eq(publications.id, id));
    return this.getPublication(id);
  }

  async deletePublication(id: string): Promise<boolean> {
    const result = await this.db.delete(publications).where(eq(publications.id, id));
    return this.wasDeleted(result);
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await this.db.select().from(events);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await this.db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = {
      ...event,
      capacity: event.capacity ?? null,
      registrationUrl: event.registrationUrl ?? null,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.insert(events).values(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    await this.db.update(events).set({ ...event, updatedAt: new Date() }).where(eq(events.id, id));
    return this.getEvent(id);
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await this.db.delete(events).where(eq(events.id, id));
    return this.wasDeleted(result);
  }

  // Gallery operations
  async getAllGallery(): Promise<Gallery[]> {
    return await this.db.select().from(gallery);
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    const result = await this.db.select().from(gallery).where(eq(gallery.id, id));
    return result[0];
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const id = randomUUID();
    const newItem: Gallery = {
      ...item,
      views: item.views ?? 0,
      duration: item.duration ?? null,
      thumbnail: item.thumbnail ?? null,
      mediaUrl: item.mediaUrl ?? null,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.insert(gallery).values(newItem);
    return newItem;
  }

  async updateGalleryItem(id: string, item: Partial<InsertGallery>): Promise<Gallery | undefined> {
    await this.db.update(gallery).set({ ...item, updatedAt: new Date() }).where(eq(gallery.id, id));
    return this.getGalleryItem(id);
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const result = await this.db.delete(gallery).where(eq(gallery.id, id));
    return this.wasDeleted(result);
  }

  // Report operations
  async getAllReports(): Promise<Report[]> {
    return await this.db.select().from(reports);
  }

  async getReport(id: string): Promise<Report | undefined> {
    const result = await this.db.select().from(reports).where(eq(reports.id, id));
    return result[0];
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = randomUUID();
    const newReport: Report = {
      ...report,
      id,
      fileUrl: report.fileUrl || null,
      status: report.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(reports).values(newReport);
    return newReport;
  }

  async updateReport(id: string, report: Partial<InsertReport>): Promise<Report | undefined> {
    await this.db.update(reports).set({ ...report, updatedAt: new Date() }).where(eq(reports.id, id));
    return this.getReport(id);
  }

  async deleteReport(id: string): Promise<boolean> {
    const result = await this.db.delete(reports).where(eq(reports.id, id));
    return this.wasDeleted(result);
  }

  // Setting operations
  async getAllSettings(): Promise<Setting[]> {
    return await this.db.select().from(settings);
  }

  async getSetting(id: string): Promise<Setting | undefined> {
    const result = await this.db.select().from(settings).where(eq(settings.id, id));
    return result[0];
  }

  async createSetting(setting: InsertSetting): Promise<Setting> {
    const id = randomUUID();
    const newSetting: Setting = { ...setting, id, createdAt: new Date(), updatedAt: new Date() };
    await this.db.insert(settings).values(newSetting);
    return newSetting;
  }

  async updateSetting(id: string, setting: Partial<InsertSetting>): Promise<Setting | undefined> {
    await this.db.update(settings).set({ ...setting, updatedAt: new Date() }).where(eq(settings.id, id));
    return this.getSetting(id);
  }

  async deleteSetting(id: string): Promise<boolean> {
    const result = await this.db.delete(settings).where(eq(settings.id, id));
    return this.wasDeleted(result);
  }

  // Member operations
  async getAllMembers(): Promise<Member[]> {
    return await this.db.select().from(members);
  }

  async getMember(id: string): Promise<Member | undefined> {
    const result = await this.db.select().from(members).where(eq(members.id, id));
    return result[0];
  }

  async createMember(member: InsertMember): Promise<Member> {
    const year = new Date().getFullYear();
    const existingMembers = await this.db.select().from(members);
    const memberCount = existingMembers.length + 1;
    const memberNumber = `${String(memberCount).padStart(4, '0')}/${year}`;

    const id = randomUUID();
    const newMember: Member = { 
      ...member, 
      id,
      memberNumber,
      photoUrl: member.photoUrl || null,
      otherInfo: member.otherInfo || null,
      status: member.status || 'pending',
      registrationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(members).values(newMember);
    return newMember;
  }

  async updateMember(id: string, member: Partial<InsertMember>): Promise<Member | undefined> {
    await this.db.update(members).set({ ...member, updatedAt: new Date() }).where(eq(members.id, id));
    return this.getMember(id);
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await this.db.delete(members).where(eq(members.id, id));
    return this.wasDeleted(result);
  }

  // Slideshow operations
  async getAllSlideshow(): Promise<Slideshow[]> {
    return await this.db.select().from(slideshow).orderBy(asc(slideshow.order));
  }

  async getSlideshow(id: string): Promise<Slideshow | undefined> {
    const result = await this.db.select().from(slideshow).where(eq(slideshow.id, id));
    return result[0];
  }

  async createSlideshow(item: InsertSlideshow): Promise<Slideshow> {
    const id = randomUUID();
    const newItem: Slideshow = {
      ...item,
      id,
      subtitle: item.subtitle || null,
      order: item.order ?? 0,
      isActive: item.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(slideshow).values(newItem);
    return newItem;
  }

  async updateSlideshow(id: string, item: Partial<InsertSlideshow>): Promise<Slideshow | undefined> {
    await this.db.update(slideshow).set({ ...item, updatedAt: new Date() }).where(eq(slideshow.id, id));
    return this.getSlideshow(id);
  }

  async deleteSlideshow(id: string): Promise<boolean> {
    const result = await this.db.delete(slideshow).where(eq(slideshow.id, id));
    return this.wasDeleted(result);
  }

  // Activity Plan operations
  async getActiveActivityPlan(): Promise<(ActivityPlan & { items: ActivityPlanItem[] }) | undefined> {
    const result = await this.db.select().from(activityPlan).where(eq(activityPlan.isActive, true)).limit(1);
    if (result.length === 0) return undefined;
    const plan = result[0];
    const items = await this.getActivityPlanItems(plan.id);
    return { ...plan, items };
  }

  async getAllActivityPlans(): Promise<ActivityPlan[]> {
    return await this.db.select().from(activityPlan).orderBy(asc(activityPlan.year));
  }

  async getActivityPlan(id: string): Promise<(ActivityPlan & { items: ActivityPlanItem[] }) | undefined> {
    const result = await this.db.select().from(activityPlan).where(eq(activityPlan.id, id));
    if (result.length === 0) return undefined;
    const plan = result[0];
    const items = await this.getActivityPlanItems(plan.id);
    return { ...plan, items };
  }

  async createActivityPlan(plan: InsertActivityPlan): Promise<ActivityPlan> {
    const id = randomUUID();
    const newPlan: ActivityPlan = {
      ...plan,
      id,
      title: plan.title || "Plano de Atividades",
      description: plan.description || null,
      isActive: plan.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(activityPlan).values(newPlan);
    return newPlan;
  }

  async updateActivityPlan(id: string, plan: Partial<InsertActivityPlan>): Promise<ActivityPlan | undefined> {
    await this.db.update(activityPlan).set({ ...plan, updatedAt: new Date() }).where(eq(activityPlan.id, id));
    const result = await this.db.select().from(activityPlan).where(eq(activityPlan.id, id));
    return result[0];
  }

  async deleteActivityPlan(id: string): Promise<boolean> {
    const result = await this.db.delete(activityPlan).where(eq(activityPlan.id, id));
    return this.wasDeleted(result);
  }

  async getActivityPlanItems(planId: string): Promise<ActivityPlanItem[]> {
    return await this.db.select().from(activityPlanItems).where(eq(activityPlanItems.planId, planId)).orderBy(asc(activityPlanItems.order));
  }

  async createActivityPlanItem(item: InsertActivityPlanItem): Promise<ActivityPlanItem> {
    const id = randomUUID();
    const newItem: ActivityPlanItem = {
      ...item,
      id,
      date: item.date || null,
      time: item.time || null,
      location: item.location || null,
      participants: item.participants || null,
      order: item.order ?? 0,
      parentId: item.parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(activityPlanItems).values(newItem);
    return newItem;
  }

  async updateActivityPlanItem(id: string, item: Partial<InsertActivityPlanItem>): Promise<ActivityPlanItem | undefined> {
    await this.db.update(activityPlanItems).set({ ...item, updatedAt: new Date() }).where(eq(activityPlanItems.id, id));
    const result = await this.db.select().from(activityPlanItems).where(eq(activityPlanItems.id, id));
    return result[0];
  }

  async deleteActivityPlanItem(id: string): Promise<boolean> {
    const result = await this.db.delete(activityPlanItems).where(eq(activityPlanItems.id, id));
    return this.wasDeleted(result);
  }

  // Social Organs operations
  async getAllOrgaosSociais(): Promise<OrgaoSocial[]> {
    return await this.db.select().from(orgaosSociais).orderBy(asc(orgaosSociais.orderIndex));
  }

  async getOrgaoSocial(id: string): Promise<OrgaoSocial | undefined> {
    const result = await this.db.select().from(orgaosSociais).where(eq(orgaosSociais.id, id));
    return result[0];
  }

  async getOrgaosSociaisByType(organType: string): Promise<OrgaoSocial[]> {
    return await this.db.select().from(orgaosSociais).where(and(eq(orgaosSociais.organType, organType), eq(orgaosSociais.isActive, true))).orderBy(asc(orgaosSociais.orderIndex));
  }

  async createOrgaoSocial(orgao: InsertOrgaoSocial): Promise<OrgaoSocial> {
    const id = randomUUID();
    const newOrgao: OrgaoSocial = {
      ...orgao,
      id,
      bio: orgao.bio || null,
      photoUrl: orgao.photoUrl || null,
      email: orgao.email || null,
      phone: orgao.phone || null,
      orderIndex: orgao.orderIndex ?? 0,
      isActive: orgao.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(orgaosSociais).values(newOrgao);
    return newOrgao;
  }

  async updateOrgaoSocial(id: string, orgao: Partial<InsertOrgaoSocial>): Promise<OrgaoSocial | undefined> {
    await this.db.update(orgaosSociais).set({ ...orgao, updatedAt: new Date() }).where(eq(orgaosSociais.id, id));
    return this.getOrgaoSocial(id);
  }

  async deleteOrgaoSocial(id: string): Promise<boolean> {
    const result = await this.db.delete(orgaosSociais).where(eq(orgaosSociais.id, id));
    return this.wasDeleted(result);
  }

  // Contact Messages operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const result = await this.db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const newMessage: ContactMessage = {
      ...message,
      id,
      phone: message.phone || null,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db.insert(contactMessages).values(newMessage);
    return newMessage;
  }

  async updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | undefined> {
    await this.db.update(contactMessages).set({ ...message, updatedAt: new Date() }).where(eq(contactMessages.id, id));
    return this.getContactMessage(id);
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await this.db.delete(contactMessages).where(eq(contactMessages.id, id));
    return this.wasDeleted(result);
  }
}

export const storage = new PostgresStorage();
