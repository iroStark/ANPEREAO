import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import path from "path";
import fs from "fs";
import { Pool } from "pg";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS configuration - must be before session
// In production, allow the Railway domain and same-origin requests
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin requests, mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In production, allow Railway domains and the app's own domain
    if (process.env.NODE_ENV === "production") {
      // Permitir o domínio principal e o subdomínio admin
      if (origin.includes('railway.app') || 
          origin.includes('anpere.ao') || 
          origin.includes('admin.anpere.ao')) {
        return callback(null, true);
      }
    }
    
    // In development, allow localhost
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    
    // For any other case in production, still allow (we're serving a SPA)
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy - required for secure cookies behind Railway's reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  
  // Middleware para redirecionar admin.anpere.ao para /admin
  app.use((req, res, next) => {
    const host = req.headers.host;
    if (host === 'admin.anpere.ao' && req.path === '/') {
      return res.redirect('/admin/login');
    }
    next();
  });
}

// Session configuration with PostgreSQL store
const PostgresSessionStore = pgSession(session);

// Create a dedicated pool for sessions
const sessionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

app.use(session({
  store: new PostgresSessionStore({
    pool: sessionPool,
    tableName: "session",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "development-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    sameSite: "lax",
    // Configura o domínio para aceitar subdomínios em produção
    domain: process.env.NODE_ENV === "production" ? ".anpere.ao" : undefined,
  },
}));

// Serve uploaded files from /uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Serve server uploads (for images uploaded via admin panel)
const serverUploadsDir = path.join(process.cwd(), "server", "uploads");
if (fs.existsSync(serverUploadsDir)) {
  app.use("/storage", express.static(serverUploadsDir));
  console.log(`[STATIC] Serving uploads from: ${serverUploadsDir}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  const listenOptions = typeof port === "string" && isNaN(Number(port)) 
    ? { path: port }
    : { port: Number(port), host: "0.0.0.0" };

  server.listen(listenOptions, () => {
    log(`serving on ${JSON.stringify(listenOptions)}`);
  });
})();
