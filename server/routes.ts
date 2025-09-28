import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Extend Express Session type to include user info
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

// Extend Express Request type to include user info
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; username: string };
  }
}

// Authentication schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Authentication middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

// Initialize default admin user
async function initializeAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  try {
    const existingAdmin = await storage.getUserByUsername(adminUsername);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
      });
      console.log(`Admin user created with username: ${adminUsername}`);
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin user
  await initializeAdmin();

  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: multerStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Tipo de arquivo não suportado. Use apenas imagens (JPG, PNG, GIF) ou vídeos (MP4, MOV, AVI).'));
      }
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((error: any) => {
      if (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  // Admin Content Management Routes
  
  // About Content routes
  app.get("/api/admin/about", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.getAboutContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ error: "Failed to fetch about content" });
    }
  });

  app.post("/api/admin/about", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.createAboutContent(req.body);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating about content:", error);
      res.status(500).json({ error: "Failed to create about content" });
    }
  });

  app.put("/api/admin/about/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const content = await storage.updateAboutContent(req.params.id, req.body);
      if (!content) {
        return res.status(404).json({ error: "About content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error updating about content:", error);
      res.status(500).json({ error: "Failed to update about content" });
    }
  });

  app.delete("/api/admin/about/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteAboutContent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "About content not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting about content:", error);
      res.status(500).json({ error: "Failed to delete about content" });
    }
  });

  // Legislation routes
  app.get("/api/admin/legislation", requireAuth, async (req: Request, res: Response) => {
    try {
      const legislation = await storage.getAllLegislation();
      res.json(legislation);
    } catch (error) {
      console.error("Error fetching legislation:", error);
      res.status(500).json({ error: "Failed to fetch legislation" });
    }
  });

  app.post("/api/admin/legislation", requireAuth, async (req: Request, res: Response) => {
    try {
      const legislation = await storage.createLegislation(req.body);
      res.status(201).json(legislation);
    } catch (error) {
      console.error("Error creating legislation:", error);
      res.status(500).json({ error: "Failed to create legislation" });
    }
  });

  app.put("/api/admin/legislation/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const legislation = await storage.updateLegislation(req.params.id, req.body);
      if (!legislation) {
        return res.status(404).json({ error: "Legislation not found" });
      }
      res.json(legislation);
    } catch (error) {
      console.error("Error updating legislation:", error);
      res.status(500).json({ error: "Failed to update legislation" });
    }
  });

  app.delete("/api/admin/legislation/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteLegislation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Legislation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting legislation:", error);
      res.status(500).json({ error: "Failed to delete legislation" });
    }
  });

  // Publications routes
  app.get("/api/admin/publications", requireAuth, async (req: Request, res: Response) => {
    try {
      const publications = await storage.getAllPublications();
      res.json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).json({ error: "Failed to fetch publications" });
    }
  });

  app.post("/api/admin/publications", requireAuth, async (req: Request, res: Response) => {
    try {
      const publication = await storage.createPublication(req.body);
      res.status(201).json(publication);
    } catch (error) {
      console.error("Error creating publication:", error);
      res.status(500).json({ error: "Failed to create publication" });
    }
  });

  app.put("/api/admin/publications/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const publication = await storage.updatePublication(req.params.id, req.body);
      if (!publication) {
        return res.status(404).json({ error: "Publication not found" });
      }
      res.json(publication);
    } catch (error) {
      console.error("Error updating publication:", error);
      res.status(500).json({ error: "Failed to update publication" });
    }
  });

  app.delete("/api/admin/publications/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deletePublication(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Publication not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting publication:", error);
      res.status(500).json({ error: "Failed to delete publication" });
    }
  });

  // Events routes
  app.get("/api/admin/events", requireAuth, async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/admin/events", requireAuth, async (req: Request, res: Response) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/admin/events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/admin/events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Gallery routes
  app.get("/api/admin/gallery", requireAuth, async (req: Request, res: Response) => {
    try {
      const gallery = await storage.getAllGallery();
      res.json(gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.post("/api/admin/gallery", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.createGalleryItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating gallery item:", error);
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  });

  app.put("/api/admin/gallery/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.updateGalleryItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating gallery item:", error);
      res.status(500).json({ error: "Failed to update gallery item" });
    }
  });

  app.delete("/api/admin/gallery/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteGalleryItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Gallery item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  });

  // Upload endpoint for gallery files
  app.post("/api/admin/upload", requireAuth, upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        type: req.file.mimetype
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: error.message || "Erro ao fazer upload do arquivo" });
    }
  });

  // Legislation endpoints
  app.get("/api/legislation", async (req: Request, res: Response) => {
    try {
      const legislation = await storage.getAllLegislation();
      res.json(legislation);
    } catch (error) {
      console.error("Error fetching legislation:", error);
      res.status(500).json({ error: "Failed to fetch legislation" });
    }
  });

  // Publications endpoints (public)
  app.get("/api/publications", async (req: Request, res: Response) => {
    try {
      const publications = await storage.getAllPublications();
      res.json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).json({ error: "Failed to fetch publications" });
    }
  });

  // Events endpoints (public)
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/legislation", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const newLegislation = await storage.createLegislation(data);
      res.json(newLegislation);
    } catch (error) {
      console.error("Error creating legislation:", error);
      res.status(500).json({ error: "Failed to create legislation" });
    }
  });

  app.put("/api/legislation/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedLegislation = await storage.updateLegislation(id, data);
      res.json(updatedLegislation);
    } catch (error) {
      console.error("Error updating legislation:", error);
      res.status(500).json({ error: "Failed to update legislation" });
    }
  });

  app.delete("/api/legislation/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteLegislation(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting legislation:", error);
      res.status(500).json({ error: "Failed to delete legislation" });
    }
  });

  // About page endpoints
  app.get("/api/about", async (req: Request, res: Response) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      console.error("Error fetching about data:", error);
      res.status(500).json({ error: "Failed to fetch about data" });
    }
  });

  app.put("/api/about", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      // For simplicity, we'll update the first about content entry
      // In a real app, you might want to handle multiple sections
      const aboutContent = await storage.getAboutContent();
      if (aboutContent.length > 0) {
        const updatedAbout = await storage.updateAboutContent(aboutContent[0].id, data);
        res.json(updatedAbout);
      } else {
        // Create new about content if none exists
        const newAbout = await storage.createAboutContent(data);
        res.json(newAbout);
      }
    } catch (error) {
      console.error("Error updating about data:", error);
      res.status(500).json({ error: "Failed to update about data" });
    }
  });

  // Gallery endpoints (public)
  app.get("/api/gallery", async (req: Request, res: Response) => {
    try {
      const gallery = await storage.getAllGallery();
      res.json(gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  // Seed endpoint - só para desenvolvimento
  app.post("/api/seed-sample-data", async (req: Request, res: Response) => {
    try {
      console.log("🌱 Iniciando seed dos dados de exemplo...");

      // 5 Eventos
      const events = [
        {
          title: "Conferência Nacional de Telecomunicações 2024",
          description: "Evento anual que reúne os principais profissionais do setor de telecomunicações para debater tendências, inovações tecnológicas e o futuro das comunicações em Angola. Palestrantes nacionais e internacionais apresentarão cases de sucesso e novas tecnologias.",
          date: "15 de Junho, 2024",
          time: "09:00 - 17:00",
          location: "Hotel Presidente, Luanda",
          type: "Conferência",
          capacity: "200",
          registrationDeadline: "10 de Junho, 2024",
          cost: "15.000 AOA",
          imageUrl: "/lovable-uploads/0194c04c-ec72-4ff9-9fd0-e1db7c6f4ef8.png"
        },
        {
          title: "Workshop: Tecnologias 5G e o Futuro das Telecomunicações",
          description: "Workshop prático sobre as novas tecnologias 5G e seu impacto no futuro das telecomunicações em Angola. Sessões hands-on com equipamentos reais e demonstrações práticas das principais funcionalidades e aplicações do 5G.",
          date: "22 de Maio, 2024",
          time: "14:00 - 18:00",
          location: "Centro de Convenções de Talatona",
          type: "Workshop",
          capacity: "50",
          registrationDeadline: "18 de Maio, 2024",
          cost: "Gratuito para membros",
          imageUrl: "/lovable-uploads/4bfb5b81-7f66-44a6-8a90-6b7a85c12c14.png"
        },
        {
          title: "Seminário de Segurança Cibernética em Telecomunicações",
          description: "Seminário especializado sobre segurança cibernética no setor de telecomunicações. Abordagem de ameaças atuais, melhores práticas de proteção, conformidade regulatória e casos práticos de implementação de segurança.",
          date: "8 de Julho, 2024",
          time: "09:30 - 16:30",
          location: "Universidade Católica de Angola, Luanda",
          type: "Seminário",
          capacity: "80",
          registrationDeadline: "3 de Julho, 2024",
          cost: "8.000 AOA",
          imageUrl: "/lovable-uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.png"
        },
        {
          title: "Curso de Certificação Profissional ANPERE",
          description: "Curso intensivo de certificação profissional para técnicos do setor de telecomunicações. Programa abrangente cobrindo aspectos técnicos, regulamentares e éticos da profissão, com certificação reconhecida nacionalmente.",
          date: "12 de Agosto, 2024",
          time: "08:00 - 17:00",
          location: "Instituto Superior Politécnico do Kwanza Sul",
          type: "Curso",
          capacity: "30",
          registrationDeadline: "5 de Agosto, 2024",
          cost: "25.000 AOA",
          imageUrl: "/lovable-uploads/0194c04c-ec72-4ff9-9fd0-e1db7c6f4ef8.png"
        },
        {
          title: "Encontro Regional de Profissionais do Interior",
          description: "Encontro regional destinado aos profissionais do interior do país para discussão de desafios específicos das telecomunicações em zonas rurais. Networking, partilha de experiências e estratégias de desenvolvimento regional.",
          date: "18 de Setembro, 2024",
          time: "09:00 - 15:00",
          location: "Hotel Kandengue, Huambo",
          type: "Encontro",
          capacity: "120",
          registrationDeadline: "12 de Setembro, 2024",
          cost: "5.000 AOA",
          imageUrl: "/lovable-uploads/4bfb5b81-7f66-44a6-8a90-6b7a85c12c14.png"
        }
      ];

      // 5 Publicações
      const publications = [
        {
          title: "Plano de Actividades ANPERE 2024",
          description: "Documento oficial que apresenta o plano estratégico e actividades previstas para o ano de 2024. Inclui objectivos, metas, cronograma de eventos, projectos de desenvolvimento profissional e iniciativas de fortalecimento do setor.",
          category: "Plano Estratégico",
          date: "Janeiro 2024",
          fileUrl: "/api/placeholder/document/plano-actividades-2024.pdf",
          downloadUrl: null
        },
        {
          title: "Relatório Anual de Actividades 2023",
          description: "Relatório completo das actividades realizadas pela ANPERE em 2023. Apresenta estatísticas de membros, eventos realizados, projectos executados, parcerias estabelecidas e impacto no desenvolvimento do setor de telecomunicações.",
          category: "Relatório",
          date: "Fevereiro 2024",
          fileUrl: "/api/placeholder/document/relatorio-anual-2023.pdf",
          downloadUrl: null
        },
        {
          title: "Código de Ética Profissional dos Técnicos em Telecomunicações",
          description: "Documento que estabelece os princípios éticos e deontológicos para o exercício da profissão de técnico em telecomunicações. Define direitos, deveres, responsabilidades e padrões de conduta profissional.",
          category: "Ética",
          date: "Março 2024",
          fileUrl: "/api/placeholder/document/codigo-etica-2024.pdf",
          downloadUrl: null
        },
        {
          title: "Manual de Boas Práticas em Instalações de Telecomunicações",
          description: "Guia técnico com as melhores práticas para instalação, manutenção e operação de equipamentos de telecomunicações. Inclui normas de segurança, procedimentos técnicos e recomendações para garantir qualidade e eficiência.",
          category: "Manual Técnico",
          date: "Abril 2024",
          fileUrl: "/api/placeholder/document/manual-boas-praticas.pdf",
          downloadUrl: null
        },
        {
          title: "Boletim Informativo - Novidades do Setor Q1 2024",
          description: "Boletim trimestral com as principais novidades, avanços tecnológicos, mudanças regulamentares e oportunidades no setor de telecomunicações. Informação actualizada para manter os profissionais informados sobre tendências do mercado.",
          category: "Boletim",
          date: "Abril 2024",
          fileUrl: "/api/placeholder/document/boletim-q1-2024.pdf",
          downloadUrl: null
        }
      ];

      // 6 Itens de Galeria
      const galleryItems = [
        {
          title: "Conferência Nacional 2023 - Cerimónia de Abertura",
          description: "Momento da cerimónia de abertura da Conferência Nacional de Telecomunicações 2023, com a presença de autoridades governamentais e líderes do setor.",
          type: "image",
          date: "Junho 2023",
          category: "Eventos",
          thumbnail: "/lovable-uploads/0194c04c-ec72-4ff9-9fd0-e1db7c6f4ef8.png",
          mediaUrl: null
        },
        {
          title: "Workshop 5G - Demonstração Prática",
          description: "Sessão prática do workshop sobre tecnologias 5G, onde os participantes puderam experimentar equipamentos de última geração.",
          type: "image",
          date: "Maio 2023",
          category: "Formação",
          thumbnail: "/lovable-uploads/4bfb5b81-7f66-44a6-8a90-6b7a85c12c14.png",
          mediaUrl: null
        },
        {
          title: "Reunião do Conselho Directivo",
          description: "Reunião mensal do conselho directivo da ANPERE para discussão de estratégias e tomada de decisões importantes para a associação.",
          type: "image",
          date: "Abril 2023",
          category: "Institucional",
          thumbnail: "/lovable-uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.png",
          mediaUrl: null
        },
        {
          title: "Cerimónia de Certificação Profissional",
          description: "Cerimónia de entrega de certificados aos novos profissionais certificados pela ANPERE, reconhecendo sua competência técnica.",
          type: "image",
          date: "Março 2023",
          category: "Certificação",
          thumbnail: "/lovable-uploads/0194c04c-ec72-4ff9-9fd0-e1db7c6f4ef8.png",
          mediaUrl: null
        },
        {
          title: "Visita Técnica à Estação Base 5G",
          description: "Visita técnica de membros da ANPERE a uma moderna estação base 5G para conhecimento das novas tecnologias implementadas.",
          type: "image",
          date: "Fevereiro 2023",
          category: "Visitas",
          thumbnail: "/lovable-uploads/4bfb5b81-7f66-44a6-8a90-6b7a85c12c14.png",
          mediaUrl: null
        },
        {
          title: "Assembleia Geral Anual 2024",
          description: "Assembleia geral anual da ANPERE com apresentação de relatórios, aprovação de contas e eleições para novos cargos directivos.",
          type: "image",
          date: "Janeiro 2024",
          category: "Assembleia",
          thumbnail: "/lovable-uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.png",
          mediaUrl: null
        }
      ];

      // Inserir eventos
      let eventsCount = 0;
      for (const event of events) {
        const insertedEvent = await storage.createEvent(event);
        if (insertedEvent) {
          eventsCount++;
          console.log(`✅ Evento criado: ${event.title}`);
        }
      }

      // Inserir publicações
      let publicationsCount = 0;
      for (const publication of publications) {
        const insertedPublication = await storage.createPublication(publication);
        if (insertedPublication) {
          publicationsCount++;
          console.log(`✅ Publicação criada: ${publication.title}`);
        }
      }

      // Inserir itens de galeria
      let galleryCount = 0;
      for (const galleryItem of galleryItems) {
        const insertedGallery = await storage.createGalleryItem(galleryItem);
        if (insertedGallery) {
          galleryCount++;
          console.log(`✅ Item de galeria criado: ${galleryItem.title}`);
        }
      }

      console.log(`🎉 Seed concluído! Criados: ${eventsCount} eventos, ${publicationsCount} publicações, ${galleryCount} itens de galeria`);

      res.json({
        success: true,
        message: "Dados de exemplo criados com sucesso!",
        eventsCount,
        publicationsCount,
        galleryCount
      });

    } catch (error: any) {
      console.error("❌ Erro no seed:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao criar dados de exemplo",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
