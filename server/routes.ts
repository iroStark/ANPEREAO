import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
