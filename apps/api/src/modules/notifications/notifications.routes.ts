import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get(
  "/",
  asyncHandler(async (req, res) =>
    ok(
      res,
      await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        take: 50
      })
    )
  )
);

notificationsRouter.patch(
  "/:id/read",
  asyncHandler(async (req, res) =>
    ok(
      res,
      await prisma.notification.updateMany({
        where: { id: req.params.id, userId: req.user!.id },
        data: { status: "read", readAt: new Date() }
      })
    )
  )
);
