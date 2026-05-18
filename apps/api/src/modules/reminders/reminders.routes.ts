import { getMaintenanceUrgency } from "@drivecare/shared";
import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";

export const remindersRouter = Router();
remindersRouter.use(requireAuth);

remindersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.user!.id },
      include: { vehicle: { select: { brand: true, model: true, currentMileage: true } } },
      orderBy: [{ dueDate: "asc" }, { dueMileage: "asc" }]
    });

    return ok(
      res,
      reminders.map((reminder) => ({
        ...reminder,
        urgency: getMaintenanceUrgency({
          currentMileage: reminder.vehicle.currentMileage,
          dueMileage: reminder.dueMileage,
          dueDate: reminder.dueDate
        })
      }))
    );
  })
);

remindersRouter.patch(
  "/:id/done",
  asyncHandler(async (req, res) => {
    const reminder = await prisma.reminder.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { status: "done" }
    });
    return ok(res, reminder);
  })
);
