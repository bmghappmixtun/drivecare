import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [users, vehicles, records, aiRequests] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.maintenanceRecord.count(),
      prisma.aiRequest.count()
    ]);
    return ok(res, { users, vehicles, records, aiRequests });
  })
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) =>
    ok(
      res,
      await prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 100
      })
    )
  )
);
