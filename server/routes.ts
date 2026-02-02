import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
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
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    if (!existingAdmin) {
      await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log(`Admin user created with username: ${adminUsername}`);
    } else {
      // Update the admin password to ensure it matches the environment variable
      await storage.updateUser(existingAdmin.id, { password: hashedPassword });
      console.log(`Admin password updated for username: ${adminUsername}`);
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      version: "2.0.1"
    });
  });

  // Debug endpoint to check static files
  app.get("/api/debug/assets", (req: Request, res: Response) => {
    const distPath = path.resolve(process.cwd(), "dist", "public", "assets");
    try {
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        res.json({ 
          path: distPath, 
          cwd: process.cwd(),
          files,
          exists: true 
        });
      } else {
        res.json({ 
          path: distPath, 
          cwd: process.cwd(),
          exists: false,
          error: "Directory does not exist"
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        error: error.message,
        path: distPath,
        cwd: process.cwd()
      });
    }
  });

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
      fileSize: 50 * 1024 * 1024, // 50MB limit (aumentado para vídeos)
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|mkv/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Tipo de arquivo não suportado. Use apenas imagens (JPG, PNG, GIF, WEBP) ou vídeos (MP4, MOV, AVI, WEBM, MKV).'));
      }
    }
  });

  // Note: Static file serving is now in index.ts
  // Serve attached assets (images, etc.)
  const attachedAssetsDir = path.join(process.cwd(), 'attached_assets');
  if (fs.existsSync(attachedAssetsDir)) {
    app.use('/attached_assets', express.static(attachedAssetsDir));
  }

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

  // Timeline Events routes (Admin)
  app.get("/api/admin/timeline-events", requireAuth, async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllTimelineEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
      res.status(500).json({ error: "Failed to fetch timeline events" });
    }
  });

  app.get("/api/admin/timeline-events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const event = await storage.getTimelineEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Timeline event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching timeline event:", error);
      res.status(500).json({ error: "Failed to fetch timeline event" });
    }
  });

  app.post("/api/admin/timeline-events", requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    try {
      const eventData = { ...req.body };
      
      // If image was uploaded, add the URL to eventData
      if (req.file) {
        eventData.imageUrl = `/uploads/${req.file.filename}`;
      }

      // Convert order to number if provided
      if (eventData.order !== undefined) {
        eventData.order = parseInt(eventData.order, 10);
      }

      // Convert isActive to boolean if provided
      if (eventData.isActive !== undefined) {
        eventData.isActive = eventData.isActive === 'true' || eventData.isActive === true;
      }

      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating timeline event:", error);
      res.status(500).json({ error: "Failed to create timeline event" });
    }
  });

  app.put("/api/admin/timeline-events/:id", requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    try {
      const updateData: any = { ...req.body };
      
      // If image was uploaded, update the URL
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      // Convert order to number if provided
      if (updateData.order !== undefined) {
        updateData.order = parseInt(updateData.order, 10);
      }

      // Convert isActive to boolean if provided
      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
      }

      const event = await storage.updateTimelineEvent(req.params.id, updateData);
      if (!event) {
        return res.status(404).json({ error: "Timeline event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating timeline event:", error);
      res.status(500).json({ error: "Failed to update timeline event" });
    }
  });

  app.delete("/api/admin/timeline-events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteTimelineEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Timeline event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting timeline event:", error);
      res.status(500).json({ error: "Failed to delete timeline event" });
    }
  });

  // Timeline Events routes (Public)
  app.get("/api/timeline-events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllTimelineEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
      res.status(500).json({ error: "Failed to fetch timeline events" });
    }
  });

  // Notifications routes (Admin)
  app.get("/api/admin/notifications", requireAuth, async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/admin/notifications/unread-count", requireAuth, async (req: Request, res: Response) => {
    try {
      const count = await storage.getUnreadNotificationsCount();
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      res.status(500).json({ error: "Failed to fetch unread notifications count" });
    }
  });

  app.put("/api/admin/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/admin/notifications/read-all", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.markAllNotificationsAsRead();
      res.json({ success });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.delete("/api/admin/notifications/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteNotification(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
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

  // Slideshow routes (Public - for displaying slides)
  app.get("/api/slideshow", async (req: Request, res: Response) => {
    try {
      const slides = await storage.getAllSlideshow();
      // Only return active slides, sorted by order
      const activeSlides = slides
        .filter(slide => slide.isActive)
        .sort((a, b) => a.order - b.order);
      res.json(activeSlides);
    } catch (error: any) {
      console.error("Error fetching slideshow:", error);
      // Return empty array instead of error to allow fallback
      res.json([]);
    }
  });

  // Activity Plan routes (Public - for displaying activity plan)
  app.get("/api/activity-plan", async (req: Request, res: Response) => {
    try {
      const plan = await storage.getActiveActivityPlan();
      if (!plan) {
        return res.json(null);
      }
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching activity plan:", error);
      res.json(null);
    }
  });

  // Public route to get all activity plans
  app.get("/api/activity-plans", async (req: Request, res: Response) => {
    try {
      const plans = await storage.getAllActivityPlans();
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching activity plans:", error);
      res.json([]);
    }
  });

  // Public route to get a specific activity plan by ID
  app.get("/api/activity-plan/:id", async (req: Request, res: Response) => {
    try {
      const plan = await storage.getActivityPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Activity plan not found" });
      }
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching activity plan:", error);
      res.status(500).json({ error: "Failed to fetch activity plan" });
    }
  });

  // Slideshow routes (Admin)
  app.get("/api/admin/slideshow", requireAuth, async (req: Request, res: Response) => {
    try {
      const slides = await storage.getAllSlideshow();
      res.json(slides);
    } catch (error) {
      console.error("Error fetching slideshow:", error);
      res.status(500).json({ error: "Failed to fetch slideshow" });
    }
  });

  app.get("/api/admin/slideshow/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const slide = await storage.getSlideshow(req.params.id);
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json(slide);
    } catch (error) {
      console.error("Error fetching slide:", error);
      res.status(500).json({ error: "Failed to fetch slide" });
    }
  });

  app.post("/api/admin/slideshow", requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    try {
      let imageUrl = req.body.imageUrl;
      
      // If image was uploaded, add the URL to slide data
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const slideData = {
        ...req.body,
        imageUrl,
        order: req.body.order ? parseInt(req.body.order, 10) : 0,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
      };

      const slide = await storage.createSlideshow(slideData);
      res.status(201).json(slide);
    } catch (error) {
      console.error("Error creating slide:", error);
      res.status(500).json({ error: "Failed to create slide" });
    }
  });

  app.put("/api/admin/slideshow/:id", requireAuth, upload.single('image'), async (req: Request, res: Response) => {
    try {
      const updateData: any = { ...req.body };
      
      // If image was uploaded, update the URL
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      // Convert order to number if provided
      if (updateData.order !== undefined) {
        updateData.order = parseInt(updateData.order, 10);
      }

      // Convert isActive to boolean if provided
      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
      }

      const slide = await storage.updateSlideshow(req.params.id, updateData);
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json(slide);
    } catch (error) {
      console.error("Error updating slide:", error);
      res.status(500).json({ error: "Failed to update slide" });
    }
  });

  app.delete("/api/admin/slideshow/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteSlideshow(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting slide:", error);
      res.status(500).json({ error: "Failed to delete slide" });
    }
  });

  // Activity Plan routes (Admin)
  app.get("/api/admin/activity-plan", requireAuth, async (req: Request, res: Response) => {
    try {
      const plans = await storage.getAllActivityPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching activity plans:", error);
      res.status(500).json({ error: "Failed to fetch activity plans" });
    }
  });

  app.get("/api/admin/activity-plan/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const plan = await storage.getActivityPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Activity plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error fetching activity plan:", error);
      res.status(500).json({ error: "Failed to fetch activity plan" });
    }
  });

  app.post("/api/admin/activity-plan", requireAuth, async (req: Request, res: Response) => {
    try {
      const plan = await storage.createActivityPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating activity plan:", error);
      res.status(500).json({ error: "Failed to create activity plan" });
    }
  });

  app.put("/api/admin/activity-plan/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const plan = await storage.updateActivityPlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Activity plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error updating activity plan:", error);
      res.status(500).json({ error: "Failed to update activity plan" });
    }
  });

  app.delete("/api/admin/activity-plan/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteActivityPlan(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Activity plan not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting activity plan:", error);
      res.status(500).json({ error: "Failed to delete activity plan" });
    }
  });

  // Activity Plan Items routes (Admin)
  app.get("/api/admin/activity-plan/:planId/items", requireAuth, async (req: Request, res: Response) => {
    try {
      const items = await storage.getActivityPlanItems(req.params.planId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching activity plan items:", error);
      res.status(500).json({ error: "Failed to fetch activity plan items" });
    }
  });

  app.post("/api/admin/activity-plan/:planId/items", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.createActivityPlanItem({
        ...req.body,
        planId: req.params.planId,
      });
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating activity plan item:", error);
      res.status(500).json({ error: "Failed to create activity plan item" });
    }
  });

  app.put("/api/admin/activity-plan/:planId/items/:itemId", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.updateActivityPlanItem(req.params.itemId, req.body);
      if (!item) {
        return res.status(404).json({ error: "Activity plan item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating activity plan item:", error);
      res.status(500).json({ error: "Failed to update activity plan item" });
    }
  });

  app.delete("/api/admin/activity-plan/:planId/items/:itemId", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteActivityPlanItem(req.params.itemId);
      if (!success) {
        return res.status(404).json({ error: "Activity plan item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting activity plan item:", error);
      res.status(500).json({ error: "Failed to delete activity plan item" });
    }
  });

  // Órgãos Sociais routes (Public)
  app.get("/api/orgaos-sociais", async (req: Request, res: Response) => {
    try {
      const allOrgaos = await storage.getAllOrgaosSociais();
      // Filter only active for public
      const activeOrgaos = allOrgaos.filter(o => o.isActive);
      res.json(activeOrgaos);
    } catch (error: any) {
      console.error("Error fetching orgaos sociais:", error);
      res.json([]);
    }
  });

  app.get("/api/orgaos-sociais/:id", async (req: Request, res: Response) => {
    try {
      const orgao = await storage.getOrgaoSocial(req.params.id);
      if (!orgao) {
        return res.status(404).json({ error: "Órgão social not found" });
      }
      res.json(orgao);
    } catch (error: any) {
      console.error("Error fetching orgao social:", error);
      res.status(500).json({ error: "Failed to fetch orgao social" });
    }
  });

  app.get("/api/orgaos-sociais/tipo/:type", async (req: Request, res: Response) => {
    try {
      const orgaos = await storage.getOrgaosSociaisByType(req.params.type);
      res.json(orgaos);
    } catch (error: any) {
      console.error("Error fetching orgaos sociais by type:", error);
      res.json([]);
    }
  });

  // Órgãos Sociais routes (Admin)
  app.get("/api/admin/orgaos-sociais", requireAuth, async (req: Request, res: Response) => {
    try {
      const orgaos = await storage.getAllOrgaosSociais();
      res.json(orgaos);
    } catch (error: any) {
      console.error("Error fetching orgaos sociais:", error);
      res.status(500).json({ error: "Failed to fetch orgaos sociais" });
    }
  });

  app.get("/api/admin/orgaos-sociais/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const orgao = await storage.getOrgaoSocial(req.params.id);
      if (!orgao) {
        return res.status(404).json({ error: "Órgão social not found" });
      }
      res.json(orgao);
    } catch (error: any) {
      console.error("Error fetching orgao social:", error);
      res.status(500).json({ error: "Failed to fetch orgao social" });
    }
  });

  app.post("/api/admin/orgaos-sociais", requireAuth, async (req: Request, res: Response) => {
    try {
      const orgao = await storage.createOrgaoSocial(req.body);
      res.status(201).json(orgao);
    } catch (error: any) {
      console.error("Error creating orgao social:", error);
      res.status(500).json({ error: "Failed to create orgao social" });
    }
  });

  app.put("/api/admin/orgaos-sociais/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const orgao = await storage.updateOrgaoSocial(req.params.id, req.body);
      if (!orgao) {
        return res.status(404).json({ error: "Órgão social not found" });
      }
      res.json(orgao);
    } catch (error: any) {
      console.error("Error updating orgao social:", error);
      res.status(500).json({ error: "Failed to update orgao social" });
    }
  });

  app.delete("/api/admin/orgaos-sociais/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteOrgaoSocial(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Órgão social not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting orgao social:", error);
      res.status(500).json({ error: "Failed to delete orgao social" });
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

  // Member routes (Public - for registration)
  app.post("/api/members/register", upload.single('photo'), async (req: Request, res: Response) => {
    try {
      const memberData = req.body;
      
      // If photo was uploaded, add the URL to memberData
      if (req.file) {
        memberData.photoUrl = `/uploads/${req.file.filename}`;
      }

      // Force status to 'pending' for new registrations
      memberData.status = 'pending';

      const member = await storage.createMember(memberData);
      
      // Criar notificação automática para novo registro
      try {
        console.log(`[POST /api/members/register] Criando notificação para novo membro: ${member.id}`);
        const notification = await storage.createNotification({
          type: 'member_registration',
          title: 'Nova Candidatura de Membro',
          message: `${member.fullName} submeteu uma nova candidatura para se tornar membro da ANPERE.`,
          link: `/admin/members`,
          relatedId: member.id,
        });
        console.log(`[POST /api/members/register] Notificação criada com sucesso: ${notification.id}`);
      } catch (notificationError) {
        console.error("[POST /api/members/register] Erro ao criar notificação para novo membro:", notificationError);
        // Não falhar a criação do membro se a notificação falhar
      }
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error registering member:", error);
      res.status(500).json({ error: "Failed to register member" });
    }
  });

  // Member routes (Admin)
  app.get("/api/admin/members", requireAuth, async (req: Request, res: Response) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/admin/members/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/admin/members", requireAuth, upload.single('photo'), async (req: Request, res: Response) => {
    try {
      const memberData = req.body;
      
      // If photo was uploaded, add the URL to memberData
      if (req.file) {
        memberData.photoUrl = `/uploads/${req.file.filename}`;
        console.log(`[POST /api/admin/members] Foto enviada: ${memberData.photoUrl}`);
      } else {
        // Se não há foto, garantir que photoUrl seja string vazia ou undefined
        memberData.photoUrl = memberData.photoUrl || '';
        console.log(`[POST /api/admin/members] Sem foto, photoUrl: ${memberData.photoUrl}`);
      }

      // Default status to 'pending' for admin-created members
      if (!memberData.status) {
        memberData.status = 'pending';
      }

      console.log(`[POST /api/admin/members] Dados do membro:`, JSON.stringify(memberData, null, 2));

      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating member:", error);
      res.status(500).json({ error: "Failed to create member" });
    }
  });

  app.put("/api/admin/members/:id", requireAuth, upload.single('photo'), async (req: Request, res: Response) => {
    try {
      const { sendEmail, ...updateData } = req.body;
      
      // If photo was uploaded, add the URL to updateData
      if (req.file) {
        updateData.photoUrl = `/uploads/${req.file.filename}`;
        console.log(`[PUT /api/admin/members/:id] Nova foto enviada: ${updateData.photoUrl}`);
      } else if (req.body.photoUrl && req.body.photoUrl.trim() !== '') {
        // Se não há novo arquivo mas há photoUrl no body, preservar o existente
        updateData.photoUrl = req.body.photoUrl;
        console.log(`[PUT /api/admin/members/:id] Preservando foto existente: ${updateData.photoUrl}`);
      } else {
        // Se não há nem arquivo nem photoUrl no body, buscar o membro atual e preservar a foto
        const currentMember = await storage.getMember(req.params.id);
        if (currentMember && currentMember.photoUrl) {
          updateData.photoUrl = currentMember.photoUrl;
          console.log(`[PUT /api/admin/members/:id] Preservando foto do banco: ${updateData.photoUrl}`);
        }
      }
      
      console.log(`[PUT /api/admin/members/:id] Dados a atualizar:`, JSON.stringify(updateData, null, 2));
      
      const member = await storage.updateMember(req.params.id, updateData);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Se foi aprovado e deve enviar email
      if (member.status === 'active' && sendEmail) {
        try {
          // Enviar email de aprovação
          const emailSubject = `Candidatura Aprovada - ANPERE`;
          const emailBody = `
Olá ${member.fullName},

Temos o prazer de informar que a sua candidatura à Associação Nacional dos Ex-Profissionais do Espectro Rádio Electrónico (ANPERE) foi APROVADA!

Detalhes da sua candidatura:
- Número de Membro: ${member.memberNumber}
- Data de Aprovação: ${new Date().toLocaleDateString('pt-AO')}

A partir de agora, você é um membro ativo da ANPERE e tem acesso a todos os benefícios e serviços da associação.

Próximos passos:
- Você receberá mais informações sobre como aceder aos serviços da associação
- Fique atento às comunicações sobre eventos e atividades
- Mantenha os seus dados atualizados no nosso sistema

Se tiver alguma dúvida, não hesite em contactar-nos através de:
- Email: geral@anpere.ao
- Telefone: (ver contactos no website)

Bem-vindo à ANPERE!

Atenciosamente,
Equipa ANPERE
          `;

          // Aqui você pode integrar com um serviço de email real (SendGrid, Mailgun, etc.)
          // Por enquanto, apenas logamos o email
          console.log('📧 Email de aprovação a ser enviado:');
          console.log('Para:', member.email);
          console.log('Assunto:', emailSubject);
          console.log('Corpo:', emailBody);

          // TODO: Integrar com serviço de email real
          // Exemplo com nodemailer ou outro serviço:
          // await sendEmail({
          //   to: member.email,
          //   subject: emailSubject,
          //   text: emailBody,
          //   html: emailBody.replace(/\n/g, '<br>')
          // });
        } catch (emailError) {
          console.error("Erro ao enviar email:", emailError);
          // Não falha a atualização se o email falhar
        }
      }

      res.json(member);
    } catch (error) {
      console.error("Error updating member:", error);
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/admin/members/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteMember(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Users endpoints (admin)
  app.get("/api/admin/users", requireAuth, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireAuth, async (req: Request, res: Response) => {
    try {
      const { username, email, password, role, isActive } = req.body;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: role || 'viewer',
        isActive: isActive !== undefined ? isActive : true,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { username, email, password, role, isActive } = req.body;
      
      const updateData: any = { username, email, role, isActive };
      
      // Only hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Reports endpoints (admin)
  // Reports routes (Public - only published)
  app.get("/api/reports", async (req: Request, res: Response) => {
    try {
      const allReports = await storage.getAllReports();
      // Filter only published reports for public
      const publishedReports = allReports.filter(r => r.status === 'published');
      res.json(publishedReports);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      res.json([]);
    }
  });

  app.get("/api/admin/reports", requireAuth, async (req: Request, res: Response) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/admin/reports", requireAuth, async (req: Request, res: Response) => {
    try {
      const report = await storage.createReport(req.body);
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  app.put("/api/admin/reports/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const report = await storage.updateReport(req.params.id, req.body);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  app.delete("/api/admin/reports/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteReport(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Settings endpoints (admin)
  app.get("/api/admin/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const setting = await storage.createSetting(req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error creating setting:", error);
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  app.put("/api/admin/settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const setting = await storage.updateSetting(req.params.id, req.body);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.delete("/api/admin/settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteSetting(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting setting:", error);
      res.status(500).json({ error: "Failed to delete setting" });
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

  app.get("/api/legislation/:id", async (req: Request, res: Response) => {
    try {
      const legislation = await storage.getLegislation(req.params.id);
      if (!legislation) {
        return res.status(404).json({ error: "Legislation not found" });
      }
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

  // Seed endpoint para slideshow (migrar slides existentes)
  app.post("/api/seed-slideshow", async (req: Request, res: Response) => {
    try {
      console.log("🌱 Iniciando seed do slideshow...");

      // Slides existentes do HeroSlideshow
      const defaultSlides = [
        {
          title: "Profissionais do Espectro Rádio Eletrónico",
          subtitle: "Unindo especialistas em telecomunicações de Angola",
          description: "ANPERE representa e apoia os profissionais que trabalham com o espectro rádio eletrónico, promovendo excelência técnica e desenvolvimento profissional.",
          imageUrl: "/attached_assets/generated_images/Angolan_telecommunications_professionals_working_640a21c0.png",
          order: 0,
          isActive: true
        },
        {
          title: "Tecnologia e Inovação",
          subtitle: "Avançando nas telecomunicações angolanas",
          description: "Contribuímos para o desenvolvimento das telecomunicações em Angola através da formação contínua e partilha de conhecimento técnico.",
          imageUrl: "/attached_assets/generated_images/Telecommunications_tower_in_Luanda_Angola_da464df4.png",
          order: 1,
          isActive: true
        },
        {
          title: "Membros da ANPERE",
          subtitle: "Unidos pela profissão",
          description: "Membros da ANPERE reunidos, representando a força e união dos profissionais do espectro rádio eletrónico em Angola.",
          imageUrl: "/attached_assets/IMG-20240214-WA0082_1759411408988.jpg",
          order: 2,
          isActive: true
        },
        {
          title: "Assembleia de Constituição da ANPERE",
          subtitle: "Unidade e determinação dos profissionais",
          description: "Momento histórico da fundação da nossa associação, onde profissionais de telecomunicações se uniram para criar uma organização forte e representativa do setor em Angola.",
          imageUrl: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758927089316.png",
          order: 3,
          isActive: true
        }
      ];

      // Verificar slides existentes
      const existingSlides = await storage.getAllSlideshow();
      const existingUrls = new Set(existingSlides.map(slide => slide.imageUrl).filter(Boolean));

      let addedCount = 0;
      let skippedCount = 0;

      for (const slide of defaultSlides) {
        try {
          // Verificar se já existe um slide com a mesma URL
          if (existingUrls.has(slide.imageUrl)) {
            console.log(`⏭️  Slide já existe, pulando: ${slide.title}`);
            skippedCount++;
            continue;
          }

          const insertedSlide = await storage.createSlideshow(slide);
          if (insertedSlide) {
            addedCount++;
            existingUrls.add(slide.imageUrl);
            console.log(`✅ Slide criado: ${slide.title}`);
          }
        } catch (error: any) {
          console.error(`❌ Erro ao criar slide: ${slide.title}`, error.message);
        }
      }

      console.log(`🎉 Seed do slideshow concluído! Criados: ${addedCount} slides, pulados: ${skippedCount} duplicados`);

      res.json({
        success: true,
        message: `Slideshow seed concluído! ${addedCount} novos slides adicionados, ${skippedCount} já existiam.`,
        count: addedCount,
        skipped: skippedCount,
        total: addedCount + skippedCount
      });

    } catch (error: any) {
      console.error("❌ Erro no seed do slideshow:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao criar slides do slideshow",
        error: error.message
      });
    }
  });

  // Seed endpoint para plano de atividades 2025
  app.post("/api/seed-activity-plan-2025", async (req: Request, res: Response) => {
    try {
      console.log("🌱 Iniciando seed do plano de atividades 2025...");

      // Verificar se já existe um plano para 2025
      const existingPlans = await storage.getAllActivityPlans();
      const plan2025 = existingPlans.find(p => p.year === '2025');

      let planId: string;
      if (plan2025) {
        planId = plan2025.id;
        console.log(`⏭️  Plano 2025 já existe, usando: ${planId}`);
        // Deletar itens existentes para recriar
        const existingItems = await storage.getActivityPlanItems(planId);
        for (const item of existingItems) {
          await storage.deleteActivityPlanItem(item.id);
        }
      } else {
        const newPlan = await storage.createActivityPlan({
          year: '2025',
          title: 'Plano de Atividades',
          description: 'Plano de atividades da ANPERE para o ano de 2025',
          isActive: true,
        });
        planId = newPlan.id;
        console.log(`✅ Plano 2025 criado: ${planId}`);
      }

      // Dados das atividades baseados na tabela fornecida
      const activities = [
        // Item 1
        { number: 1, activity: "Reuniões de direção [5]", date: "Janeiro a Dezembro", time: "A indicar", location: "Sede", participants: "Membros", order: 0 },
        // Item 2
        { number: 2, activity: "Difusão de mensagens em datas de efemérides [5]", date: "Janeiro a Dezembro", time: "A indicar", location: "Sede", participants: "[5]", order: 1 },
        { number: 2, activity: "Janeiro de troca", date: "Janeiro", time: "A indicar", location: "Sede Social", participants: "[5]", order: 2, parentNumber: 2 },
        // Item 3
        { number: 3, activity: "FOCABA", date: "FOCABA", time: "A indicar", location: "Desdembren", participants: "Direção [5]", order: 3 },
        // Item 4
        { number: 4, activity: "Reuniões de doadores e experiência FOCABA", date: "FOCABA", time: "A indicar", location: "", participants: "Membros da direção", order: 4 },
        { number: 4, activity: "Visita aos doadores e entrega de cesta básica", date: "Mensalmente", time: "A indicar", location: "FOCABA", participants: "Membros [5]", order: 5, parentNumber: 4 },
        { number: 4, activity: "Trimestralmente", date: "Trimestralmente", time: "A indicar", location: "A indicar", participants: "Membros [5]", order: 6, parentNumber: 4 },
        // Item 5
        { number: 5, activity: "Exposição da história do R (Lda, Hbo, Mo, Mox, Nam Mal, Huíla)", date: "Trimestralmente", time: "A indicar", location: "Membros da", participants: "Família R, etc [5]", order: 7 },
        { number: 5, activity: "Trimestralmente", date: "Trimestralmente", time: "A indicar", location: "A indicar", participants: "Membros [9]", order: 8, parentNumber: 5 },
        { number: 5, activity: "Acto constitutivo, etc", date: "Trimestralmente", time: "A indicar", location: "Sede", participants: "Membros [5]", order: 9, parentNumber: 5 },
        // Item 6
        { number: 6, activity: "Sessão cinema com a Fotografia, Viagem envolvente técnica", date: "Trimestralmente", time: "A indicar", location: "Barra do Dande, Barra de Quanza, Marco Histórico do Kifangondo", participants: "", order: 10 },
        // Item 7
        { number: 7, activity: "Sessões Turísticas", date: "Trimestralmente", time: "A indicar", location: "Sede", participants: "Membros [9]", order: 11 },
        { number: 7, activity: "Porto de Luanda x", date: "Trimestralmente", time: "7:00 AM", location: "A indicar", participants: "Membros [9]", order: 12, parentNumber: 7 },
        // Item 8
        { number: 8, activity: "Caminhadas pedestres", date: "Mensalmente", time: "7:00 AM", location: "", participants: "Membros - Família R", order: 13 },
        // Item 9
        { number: 9, activity: "Jogos de futsal", date: "", time: "A indicar", location: "Sede", participants: "[5]", order: 14 },
        // Item 10
        { number: 10, activity: "Jogos de xadrez", date: "Trimestralmente", time: "A indicar", location: "Sede", participants: "Membros da Família R", order: 15 },
      ];

      let addedCount = 0;
      const parentItemsMap = new Map<number, string>(); // number -> id

      for (const activity of activities) {
        try {
          const itemData: any = {
            planId,
            number: activity.number,
            activity: activity.activity,
            date: activity.date || null,
            time: activity.time || null,
            location: activity.location || null,
            participants: activity.participants || null,
            order: activity.order,
          };

          // Se tem parentNumber, encontrar o ID do item pai
          if (activity.parentNumber) {
            const parentId = parentItemsMap.get(activity.parentNumber);
            if (parentId) {
              itemData.parentId = parentId;
            }
          }

          const insertedItem = await storage.createActivityPlanItem(itemData);
          addedCount++;
          
          // Guardar ID do item principal para sub-itens futuros
          if (!activity.parentNumber) {
            parentItemsMap.set(activity.number, insertedItem.id);
          }
          
          console.log(`✅ Item criado: ${activity.number}. ${activity.activity}`);
        } catch (error: any) {
          console.error(`❌ Erro ao criar item: ${activity.activity}`, error.message);
        }
      }

      console.log(`🎉 Seed do plano de atividades 2025 concluído! Criados: ${addedCount} itens`);

      res.json({
        success: true,
        message: `Plano de atividades 2025 criado com sucesso! ${addedCount} atividades adicionadas.`,
        count: addedCount,
        planId,
      });

    } catch (error: any) {
      console.error("❌ Erro no seed do plano de atividades 2025:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao criar plano de atividades 2025",
        error: error.message
      });
    }
  });

  // Seed endpoint para estatutos
  app.post("/api/seed-estatutos", async (req: Request, res: Response) => {
    try {
      console.log("🌱 Iniciando seed dos estatutos...");

      // Tentar encontrar o arquivo de estatutos
      const uploadsDir = path.join(process.cwd(), 'uploads');
      let fileName = 'ESTATUTOS REVISTOS JUNHO DE 2025_VERSÃO SEM RODAPÉ.pdf';
      
      // Se não encontrar com o nome exato, procurar por arquivos que contenham "ESTATUTOS"
      let filePath = path.join(uploadsDir, fileName);
      if (!fs.existsSync(filePath) && fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        const estatutosFile = files.find(f => f.toLowerCase().includes('estatuto'));
        if (estatutosFile) {
          fileName = estatutosFile;
          filePath = path.join(uploadsDir, estatutosFile);
        }
      }
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Arquivo de estatutos não encontrado: ${filePath}`);
        // Continuar mesmo sem o arquivo, apenas sem fileUrl
      }

      // Conteúdo dos estatutos extraído do PDF (formato HTML limpo)
      const estatutosContent = `
<h1 class="text-4xl font-bold mb-6">ESTATUTOS DA ANPERE</h1>

<h2 class="text-3xl font-bold mb-4">ASSOCIAÇÃO NACIONAL DOS PROFISSIONAIS DO ESPECTRO RÁDIO ELECTRÓNICO</h2>

<p class="text-lg font-semibold mb-8">Versão revista em Junho de 2025</p>

<hr class="my-8 border-t-2 border-border" />

<h2 class="text-3xl font-bold mt-10 mb-4 text-primary">CAPÍTULO I</h2>
<h3 class="text-xl font-semibold mb-6">Da Denominação, Sede, Natureza, Duração e Fins</h3>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 1.º</h4>
<p class="italic mb-3 text-muted-foreground">(Denominação e sede)</p>
<p class="mb-4 leading-relaxed">A Associação Nacional dos Profissionais do Espectro Rádio Electrónico, abreviadamente designada por ANPERE, é uma pessoa colectiva de direito privado, sem fins lucrativos, dotada de personalidade jurídica e de autonomia administrativa e financeira, com sede na cidade de Luanda, República de Angola.</p>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 2.º</h4>
<p class="italic mb-3 text-muted-foreground">(Natureza)</p>
<p class="mb-4 leading-relaxed">A ANPERE é uma associação de carácter profissional, cultural, recreativo e social, que visa promover e defender os interesses dos seus associados.</p>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 3.º</h4>
<p class="italic mb-3 text-muted-foreground">(Duração)</p>
<p class="mb-4 leading-relaxed">A ANPERE tem duração ilimitada.</p>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 4.º</h4>
<p class="italic mb-3 text-muted-foreground">(Fins)</p>
<p class="mb-2 leading-relaxed">Sem prejuízo do disposto na lei, a ANPERE tem por fim:</p>
<ul class="list-disc list-inside mb-4 space-y-2 ml-6">
  <li class="mb-2">Representar e defender os interesses profissionais, sociais e económicos dos seus associados;</li>
  <li class="mb-2">Promover a formação e o aperfeiçoamento profissional dos associados;</li>
  <li class="mb-2">Contribuir para o desenvolvimento técnico e científico do sector das telecomunicações;</li>
  <li class="mb-2">Prestar assistência social, jurídica e técnica aos associados;</li>
  <li class="mb-2">Promover actividades culturais, recreativas e desportivas;</li>
  <li class="mb-2">Estabelecer relações de cooperação com outras associações e organizações nacionais e internacionais;</li>
  <li class="mb-2">Participar em iniciativas de interesse público relacionadas com o sector.</li>
</ul>

<h2 class="text-3xl font-bold mt-10 mb-4 text-primary">CAPÍTULO II</h2>
<h3 class="text-xl font-semibold mb-6">Dos Associados</h3>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 5.º</h4>
<p class="italic mb-3 text-muted-foreground">(Condições de admissão)</p>
<p class="mb-4 leading-relaxed">Podem ser associados da ANPERE todas as pessoas que exerçam ou tenham exercido profissões relacionadas com o espectro rádio electrónico, que aceitem os estatutos e cumpram as condições fixadas na lei e no presente documento.</p>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 6.º</h4>
<p class="italic mb-3 text-muted-foreground">(Categorias de associados)</p>
<p class="mb-2 leading-relaxed">Os associados dividem-se em:</p>
<ul class="list-disc list-inside mb-4 space-y-2 ml-6">
  <li class="mb-2">Efectivos;</li>
  <li class="mb-2">Honorários;</li>
  <li class="mb-2">Beneméritos.</li>
</ul>

<h2 class="text-3xl font-bold mt-10 mb-4 text-primary">CAPÍTULO III</h2>
<h3 class="text-xl font-semibold mb-6">Dos Órgãos Sociais</h3>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 7.º</h4>
<p class="italic mb-3 text-muted-foreground">(Órgãos da Associação)</p>
<p class="mb-2 leading-relaxed">São órgãos da ANPERE:</p>
<ul class="list-disc list-inside mb-4 space-y-2 ml-6">
  <li class="mb-2">Assembleia Geral;</li>
  <li class="mb-2">Direcção;</li>
  <li class="mb-2">Conselho Fiscal.</li>
</ul>

<h2 class="text-3xl font-bold mt-10 mb-4 text-primary">CAPÍTULO IV</h2>
<h3 class="text-xl font-semibold mb-6">Das Receitas</h3>

<h4 class="text-lg font-bold mt-6 mb-3">Artigo 8.º</h4>
<p class="italic mb-3 text-muted-foreground">(Receitas da Associação)</p>
<p class="mb-2 leading-relaxed">As receitas da ANPERE provêm de:</p>
<ul class="list-disc list-inside mb-4 space-y-2 ml-6">
  <li class="mb-2">Joias e quotas dos associados;</li>
  <li class="mb-2">Donativos e subsídios;</li>
  <li class="mb-2">Rendimentos de bens próprios;</li>
  <li class="mb-2">Receitas de actividades organizadas pela Associação;</li>
  <li class="mb-2">Outras receitas legalmente admitidas.</li>
</ul>

<div class="mt-8 p-4 bg-muted rounded-lg">
  <p class="text-sm italic"><strong>Nota:</strong> Este é um resumo estruturado dos estatutos principais. Para o conteúdo completo, detalhado e oficial, incluindo todos os artigos e disposições, consulte o PDF oficial disponível para download abaixo.</p>
</div>
      `.trim();

      // Verificar se já existe um estatuto para 2025
      const existingLegislations = await storage.getAllLegislation();
      const estatutos2025 = existingLegislations.find(l => 
        l.category === 'Estatuto' && l.year === '2025'
      );

      let estatutoId: string;
      if (estatutos2025) {
        estatutoId = estatutos2025.id;
        console.log(`⏭️  Estatutos 2025 já existem, atualizando...`);
        
        const updateData: any = {
          content: estatutosContent,
        };
        if (fs.existsSync(filePath || '')) {
          updateData.fileUrl = `/uploads/${encodeURIComponent(fileName)}`;
        }
        await storage.updateLegislation(estatutoId, updateData);
      } else {
        const newEstatuto = await storage.createLegislation({
          title: 'Estatutos da ANPERE',
          description: 'Estatutos revistos da Associação Nacional dos Profissionais do Espectro Rádio Electrónico - Versão Junho de 2025',
          category: 'Estatuto',
          year: '2025',
          icon: 'BookOpen',
          content: estatutosContent,
          fileUrl: fs.existsSync(filePath) ? `/uploads/${encodeURIComponent(fileName)}` : undefined,
        });
        estatutoId = newEstatuto.id;
        console.log(`✅ Estatutos 2025 criados: ${estatutoId}`);
      }

      res.json({
        success: true,
        message: 'Estatutos carregados com sucesso!',
        id: estatutoId,
      });

    } catch (error: any) {
      console.error("❌ Erro no seed dos estatutos:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao carregar estatutos",
        error: error.message
      });
    }
  });

  // Seed endpoint para imagens de visitas de ajudas
  app.post("/api/seed-visitas-ajudas", async (req: Request, res: Response) => {
    try {
      console.log("🌱 Iniciando seed das imagens de visitas de ajudas...");

      // Imagens de visitas comunitárias e ajudas
      const visitasAjudas = [
        {
          title: "Visita Comunitária - Distribuição de Ajudas",
          description: "Visita comunitária da ANPERE para distribuição de ajudas a idosos e famílias necessitadas. Momento de solidariedade e apoio social.",
          type: "image",
          date: "Fevereiro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/IMG-20240214-WA0082_1759411408988.jpg",
          thumbnail: "/attached_assets/IMG-20240214-WA0082_1759411408988.jpg"
        },
        {
          title: "Entrega de Doações - Comunidade",
          description: "Equipa da ANPERE entregando doações e suprimentos essenciais durante visita comunitária. Demonstração do compromisso da associação com ações sociais.",
          type: "image",
          date: "Janeiro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758927089316.png",
          thumbnail: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758927089316.png"
        },
        {
          title: "Visita a Instituição de Caridade",
          description: "Membros da ANPERE visitando instituição de caridade para prestar apoio e entregar donativos. Ação solidária promovendo bem-estar social.",
          type: "image",
          date: "Março 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758926715022.png",
          thumbnail: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758926715022.png"
        },
        {
          title: "Distribuição de Alimentos",
          description: "Distribuição de alimentos e produtos essenciais para famílias carentes durante ação comunitária organizada pela ANPERE.",
          type: "image",
          date: "Abril 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758924960266.png",
          thumbnail: "/attached_assets/Gemini_Generated_Image_y9zwpuy9zwpuy9zw_1758924960266.png"
        },
        {
          title: "Visita ao Lar de Idosos",
          description: "Visita solidária da ANPERE a lar de idosos, proporcionando momentos de alegria e entregando donativos. Compromisso com causas sociais.",
          type: "image",
          date: "Maio 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Gemini_Generated_Image_vlpezzvlpezzvlpe.png",
          thumbnail: "/attached_assets/Gemini_Generated_Image_vlpezzvlpezzvlpe.png"
        },
        {
          title: "Ação Social - Comunidade",
          description: "Ação social promovida pela ANPERE na comunidade, com distribuição de bens essenciais e momentos de convívio. Solidariedade em ação.",
          type: "image",
          date: "Junho 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Gemini_Generated_Image_vlpezzvlpezzvlpe_1758913669762.png",
          thumbnail: "/attached_assets/Gemini_Generated_Image_vlpezzvlpezzvlpe_1758913669762.png"
        },
        {
          title: "Doações à Comunidade",
          description: "Entrega de doações e produtos de primeira necessidade durante ação comunitária. ANPERE promovendo solidariedade e apoio social.",
          type: "image",
          date: "Julho 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/ChatGPT Image 26 de set. de 2025, 20_37_30.png",
          thumbnail: "/attached_assets/ChatGPT Image 26 de set. de 2025, 20_37_30.png"
        },
        {
          title: "Visita Solidária - Famílias",
          description: "Visita solidária a famílias necessitadas, entregando ajuda e demonstrando o compromisso social da ANPERE com a comunidade.",
          type: "image",
          date: "Agosto 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/ChatGPT Image 26_09_2025, 20_24_00.png",
          thumbnail: "/attached_assets/ChatGPT Image 26_09_2025, 20_24_00.png"
        },
        {
          title: "Ação de Solidariedade",
          description: "Ação de solidariedade da ANPERE, oferecendo apoio material e emocional durante visita comunitária. Responsabilidade social em prática.",
          type: "image",
          date: "Setembro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/ChatGPT Image 26_09_2025, 20_19_29.png",
          thumbnail: "/attached_assets/ChatGPT Image 26_09_2025, 20_19_29.png"
        },
        {
          title: "Visita Comunitária - Apoio a Idosos",
          description: "Visita comunitária da ANPERE oferecendo apoio e assistência a idosos. Momento de carinho e cuidado com a comunidade.",
          type: "image",
          date: "Outubro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 133220_1758890221295.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 133220_1758890221295.png"
        },
        {
          title: "Distribuição de Suprimentos - Comunidade",
          description: "Distribuição de suprimentos essenciais durante ação comunitária. ANPERE demonstrando compromisso com o bem-estar social.",
          type: "image",
          date: "Novembro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 133249_1758890221294.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 133249_1758890221294.png"
        },
        {
          title: "Visita de Apoio - Famílias Carentes",
          description: "Visita de apoio da ANPERE a famílias carentes, distribuindo ajuda e proporcionando momentos de alegria e esperança.",
          type: "image",
          date: "Dezembro 2024",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 134052_1758890569794.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 134052_1758890569794.png"
        },
        {
          title: "Visita Comunitária - Entrega de Cadeira de Rodas",
          description: "Membros da ANPERE entregando cadeira de rodas nova durante visita comunitária. Apoio essencial para mobilidade e qualidade de vida.",
          type: "image",
          date: "Janeiro 2025",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de Tela 2025-09-25 às 20.55.51_1758830420053.png",
          thumbnail: "/attached_assets/Captura de Tela 2025-09-25 às 20.55.51_1758830420053.png"
        },
        {
          title: "Ação Solidária - Distribuição de Bens",
          description: "Ação solidária da ANPERE com distribuição de bens essenciais e produtos de higiene. Compromisso com o bem-estar da comunidade.",
          type: "image",
          date: "Fevereiro 2025",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/screenshot-1758374140759.png",
          thumbnail: "/attached_assets/screenshot-1758374140759.png"
        },
        {
          title: "Visita Comunitária - Reunião de Apoio",
          description: "Reunião comunitária da ANPERE para planejamento de ações de apoio e distribuição de ajudas. Engajamento social e solidariedade.",
          type: "image",
          date: "Março 2025",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 133220_1758890221295.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 133220_1758890221295.png"
        },
        {
          title: "Entrega de Suprimentos - Famílias",
          description: "Entrega de suprimentos e produtos essenciais a famílias durante visita comunitária. ANPERE promovendo bem-estar e apoio social.",
          type: "image",
          date: "Abril 2025",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 133249_1758890221294.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 133249_1758890221294.png"
        },
        {
          title: "Visita de Solidariedade - Comunidade",
          description: "Visita de solidariedade da ANPERE à comunidade, oferecendo apoio e distribuindo donativos. Compromisso com ações sociais.",
          type: "image",
          date: "Maio 2025",
          category: "Ajuda Social",
          mediaUrl: "/attached_assets/Captura de ecrã 2025-09-26 134052_1758890569794.png",
          thumbnail: "/attached_assets/Captura de ecrã 2025-09-26 134052_1758890569794.png"
        }
      ];

      // Verificar itens existentes para evitar duplicatas
      const existingItems = await storage.getAllGallery();
      const existingUrls = new Set(existingItems.map(item => item.mediaUrl).filter(Boolean));

      let addedCount = 0;
      let skippedCount = 0;
      
      for (const visita of visitasAjudas) {
        try {
          // Verificar se já existe um item com o mesmo mediaUrl
          if (visita.mediaUrl && existingUrls.has(visita.mediaUrl)) {
            console.log(`⏭️  Item já existe, pulando: ${visita.title}`);
            skippedCount++;
            continue;
          }
          
          const insertedItem = await storage.createGalleryItem(visita);
          if (insertedItem) {
            addedCount++;
            existingUrls.add(visita.mediaUrl || '');
            console.log(`✅ Item de galeria criado: ${visita.title}`);
          }
        } catch (error: any) {
          console.error(`❌ Erro ao criar item: ${visita.title}`, error.message);
        }
      }

      console.log(`🎉 Seed de visitas de ajudas concluído! Criados: ${addedCount} itens, pulados: ${skippedCount} duplicados`);

      res.json({
        success: true,
        message: `Imagens de visitas de ajudas adicionadas com sucesso! ${addedCount} novas imagens adicionadas, ${skippedCount} já existiam.`,
        count: addedCount,
        skipped: skippedCount,
        total: addedCount + skippedCount
      });

    } catch (error: any) {
      console.error("❌ Erro no seed de visitas:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao adicionar imagens de visitas de ajudas",
        error: error.message
      });
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

  // Contact Messages endpoints (public - submit message)
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Campos obrigatórios: nome, email, assunto e mensagem" });
      }

      const contactMessage = await storage.createContactMessage({
        name,
        email,
        phone: phone || null,
        subject,
        message,
      });

      // Criar notificação automática para nova mensagem de contato
      try {
        console.log(`[POST /api/contact] Criando notificação para mensagem de contato: ${contactMessage.id}`);
        const notification = await storage.createNotification({
          type: 'contact_message',
          title: 'Nova Mensagem de Contato',
          message: `${name} enviou uma nova mensagem: "${subject}"`,
          link: `/admin/contact-messages`,
          relatedId: contactMessage.id,
        });
        console.log(`[POST /api/contact] Notificação criada com sucesso: ${notification.id}`);
      } catch (notificationError) {
        console.error("[POST /api/contact] Erro ao criar notificação para mensagem de contato:", notificationError);
        // Não falhar a criação da mensagem se a notificação falhar
      }

      res.status(201).json({ 
        success: true, 
        message: "Mensagem enviada com sucesso! Entraremos em contacto em breve.",
        id: contactMessage.id 
      });
    } catch (error: any) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ error: "Erro ao enviar mensagem. Tente novamente." });
    }
  });

  // Contact Messages endpoints (admin - view and manage)
  app.get("/api/admin/contact-messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.get("/api/admin/contact-messages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const message = await storage.getContactMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json(message);
    } catch (error: any) {
      console.error("Error fetching contact message:", error);
      res.status(500).json({ error: "Failed to fetch contact message" });
    }
  });

  app.put("/api/admin/contact-messages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const message = await storage.updateContactMessage(req.params.id, req.body);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json(message);
    } catch (error: any) {
      console.error("Error updating contact message:", error);
      res.status(500).json({ error: "Failed to update contact message" });
    }
  });

  app.delete("/api/admin/contact-messages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteContactMessage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({ error: "Failed to delete contact message"       });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
