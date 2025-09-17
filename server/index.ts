// server/index.ts

import "dotenv/config"; // load environment variables from .env
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStoreFactory from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// --- Drizzle ORM + Postgres ---
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "@shared/schema"; // import your users table schema
import { eq } from "drizzle-orm";

// Setup Postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle db instance (we can export this for routes)
export const db = drizzle(pool);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---- Session Setup ----
const MemoryStore = MemoryStoreFactory(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    cookie: {
      secure: false, // true if behind https
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ---- Logging Middleware ----
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

// ---- Register Routes ----
(async () => {
  const server = await registerRoutes(app);

  // --- Simple DB Connectivity Test Route (using raw SQL) ---
  app.get("/api/db-test", async (_req, res, next) => {
    try {
      const result = await pool.query("SELECT NOW() as now");
      res.json({ db_time: result.rows[0].now });
    } catch (err) {
      next(err);
    }
  });

  // --- Dashboard: User Info Route (Drizzle ORM style) ---
  app.get("/api/dashboard/me", async (req, res, next) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not logged in" });
      }

      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          //email: users.email,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, req.session.userId));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  // ---- Error Handler ----
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // ---- Development vs Production ----
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ---- Start server ----
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
