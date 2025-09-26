import { 
  type User, 
  type InsertUser,
  type AboutContent,
  type InsertAboutContent,
  type Legislation,
  type InsertLegislation,
  type Publication,
  type InsertPublication,
  type Event,
  type InsertEvent,
  type Gallery,
  type InsertGallery
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private aboutContent: Map<string, AboutContent>;
  private legislation: Map<string, Legislation>;
  private publications: Map<string, Publication>;
  private events: Map<string, Event>;
  private gallery: Map<string, Gallery>;

  constructor() {
    this.users = new Map();
    this.aboutContent = new Map();
    this.legislation = new Map();
    this.publications = new Map();
    this.events = new Map();
    this.gallery = new Map();
    
    // Initialize with some default data from existing pages
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Seed About Content
    const aboutMission: AboutContent = {
      id: randomUUID(),
      section: 'mission',
      title: 'Nossa Missão',
      content: 'Representar e promover os interesses dos profissionais do espectro radioeléctrico em Angola, fomentando a excelência técnica e o desenvolvimento sustentável do sector das telecomunicações.',
      updatedAt: new Date(),
    };
    this.aboutContent.set(aboutMission.id, aboutMission);

    const aboutVision: AboutContent = {
      id: randomUUID(),
      section: 'vision',
      title: 'Nossa Visão',
      content: 'Ser a referência nacional na representação dos profissionais das telecomunicações, contribuindo para o desenvolvimento tecnológico e social de Angola.',
      updatedAt: new Date(),
    };
    this.aboutContent.set(aboutVision.id, aboutVision);

    // Seed some legislation data
    const legislation1: Legislation = {
      id: randomUUID(),
      title: 'Lei das Comunicações Electrónicas',
      description: 'Lei fundamental que regula o sector das comunicações electrónicas em Angola',
      category: 'Lei Principal',
      year: '2023',
      icon: 'Scale',
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.legislation.set(legislation1.id, legislation1);

    // Seed some publication data
    const pub1: Publication = {
      id: randomUUID(),
      title: 'Plano de Actividades 2024',
      description: 'Planeamento estratégico das actividades da ANPERE para o ano de 2024',
      category: 'Plano',
      date: 'Janeiro 2024',
      size: '2.4 MB',
      downloads: 245,
      fileUrl: null,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.publications.set(pub1.id, pub1);

    // Seed some event data
    const event1: Event = {
      id: randomUUID(),
      title: 'Conferência Nacional de Telecomunicações 2024',
      description: 'Evento anual que reúne profissionais do sector para debater as tendências e inovações',
      date: '15 de Junho, 2024',
      time: '09:00 - 17:00',
      location: 'Hotel Presidente, Luanda',
      participants: '200+',
      status: 'upcoming',
      category: 'Conferência',
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(event1.id, event1);

    // Seed some gallery data
    const gallery1: Gallery = {
      id: randomUUID(),
      title: 'Conferência Nacional de Telecomunicações 2023',
      description: 'Momentos marcantes da conferência anual que reuniu mais de 300 profissionais',
      type: 'image',
      date: 'Junho 2023',
      category: 'Evento',
      views: 1250,
      duration: null,
      thumbnail: 'placeholder-conference.jpg',
      mediaUrl: null,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.gallery.set(gallery1.id, gallery1);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // About Content operations
  async getAboutContent(): Promise<AboutContent[]> {
    return Array.from(this.aboutContent.values());
  }

  async getAboutContentBySection(section: string): Promise<AboutContent | undefined> {
    return Array.from(this.aboutContent.values()).find(
      (content) => content.section === section
    );
  }

  async createAboutContent(insertContent: InsertAboutContent): Promise<AboutContent> {
    const id = randomUUID();
    const content: AboutContent = {
      ...insertContent,
      id,
      updatedAt: new Date(),
    };
    this.aboutContent.set(id, content);
    return content;
  }

  async updateAboutContent(id: string, updates: Partial<InsertAboutContent>): Promise<AboutContent | undefined> {
    const existing = this.aboutContent.get(id);
    if (!existing) return undefined;

    const updated: AboutContent = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.aboutContent.set(id, updated);
    return updated;
  }

  async deleteAboutContent(id: string): Promise<boolean> {
    return this.aboutContent.delete(id);
  }

  // Legislation operations
  async getAllLegislation(): Promise<Legislation[]> {
    return Array.from(this.legislation.values()).sort(
      (a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
  }

  async getLegislation(id: string): Promise<Legislation | undefined> {
    return this.legislation.get(id);
  }

  async createLegislation(insertLegislation: InsertLegislation): Promise<Legislation> {
    const id = randomUUID();
    const legislation: Legislation = {
      ...insertLegislation,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.legislation.set(id, legislation);
    return legislation;
  }

  async updateLegislation(id: string, updates: Partial<InsertLegislation>): Promise<Legislation | undefined> {
    const existing = this.legislation.get(id);
    if (!existing) return undefined;

    const updated: Legislation = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.legislation.set(id, updated);
    return updated;
  }

  async deleteLegislation(id: string): Promise<boolean> {
    return this.legislation.delete(id);
  }

  // Publication operations
  async getAllPublications(): Promise<Publication[]> {
    return Array.from(this.publications.values()).sort(
      (a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
  }

  async getPublication(id: string): Promise<Publication | undefined> {
    return this.publications.get(id);
  }

  async createPublication(insertPublication: InsertPublication): Promise<Publication> {
    const id = randomUUID();
    const publication: Publication = {
      ...insertPublication,
      downloads: insertPublication.downloads ?? 0,
      fileUrl: insertPublication.fileUrl ?? null,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.publications.set(id, publication);
    return publication;
  }

  async updatePublication(id: string, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    const existing = this.publications.get(id);
    if (!existing) return undefined;

    const updated: Publication = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.publications.set(id, updated);
    return updated;
  }

  async deletePublication(id: string): Promise<boolean> {
    return this.publications.delete(id);
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort(
      (a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      status: insertEvent.status ?? 'upcoming',
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event | undefined> {
    const existing = this.events.get(id);
    if (!existing) return undefined;

    const updated: Event = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Gallery operations
  async getAllGallery(): Promise<Gallery[]> {
    return Array.from(this.gallery.values()).sort(
      (a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
    );
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    return this.gallery.get(id);
  }

  async createGalleryItem(insertItem: InsertGallery): Promise<Gallery> {
    const id = randomUUID();
    const item: Gallery = {
      ...insertItem,
      views: insertItem.views ?? 0,
      duration: insertItem.duration ?? null,
      thumbnail: insertItem.thumbnail ?? null,
      mediaUrl: insertItem.mediaUrl ?? null,
      id,
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    this.gallery.set(id, item);
    return item;
  }

  async updateGalleryItem(id: string, updates: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const existing = this.gallery.get(id);
    if (!existing) return undefined;

    const updated: Gallery = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.gallery.set(id, updated);
    return updated;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    return this.gallery.delete(id);
  }
}

export const storage = new MemStorage();
