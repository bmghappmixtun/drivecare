import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { errorHandler } from "./middleware/error-handler.js";
import { asyncHandler } from "./utils/async-handler.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { filesRouter } from "./modules/files/files.routes.js";
import { maintenanceRouter } from "./modules/maintenance/maintenance.routes.js";
import { notificationsRouter } from "./modules/notifications/notifications.routes.js";
import { remindersRouter } from "./modules/reminders/reminders.routes.js";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        const allowedOrigins = env.WEB_ORIGIN.split(",").map((item) => item.trim());
        const isAllowedVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
        if (allowedOrigins.includes(origin) || isAllowedVercelPreview) return callback(null, true);
        return callback(null, false);
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "drivecare-api" });
  });

  app.get(
    "/health/db",
    asyncHandler(async (_req, res) => {
      const users = await prisma.user.count();
      res.json({ status: "ok", database: "connected", users });
    })
  );

  app.use("/auth", authRouter);
  app.use("/vehicles", vehiclesRouter);
  app.use("/maintenance", maintenanceRouter);
  app.use("/reminders", remindersRouter);
  app.use("/notifications", notificationsRouter);
  app.use("/files", filesRouter);
  app.use("/ai", aiRouter);
  app.use("/admin", adminRouter);
  app.use(errorHandler);

  return app;
}
