import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Use process.cwd() for production as it's more reliable in Docker containers
  // __dirname can be incorrect after esbuild bundles the server code
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  console.log(`[STATIC] Configured dist path: ${distPath}`);
  console.log(`[STATIC] Current working directory: ${process.cwd()}`);

  if (!fs.existsSync(distPath)) {
    console.error(`[STATIC] Build directory not found at: ${distPath}`);
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    // Only serve index.html for GET requests that accept HTML, 
    // to avoid serving it for missing assets causing confusing 500/200 OK errors
    if (req.method === 'GET' && req.accepts('html')) {
        const indexPath = path.resolve(distPath, "index.html");
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error(`[STATIC] Error sending index.html from ${indexPath}:`, err);
                if (!res.headersSent) {
                    res.status(500).send("Error serving application");
                }
            }
        });
    } else {
        // For non-HTML requests (like missing CSS/JS), return 404
        res.status(404).json({ message: "Not Found" });
    }
  });
}
