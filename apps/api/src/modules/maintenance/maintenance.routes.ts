import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";
import { createMaintenance, getMaintenanceStats, listMaintenance } from "./maintenance.service.js";
import { maintenanceCreateSchema, maintenanceQuerySchema } from "./maintenance.schemas.js";

export const maintenanceRouter = Router();
maintenanceRouter.use(requireAuth);

maintenanceRouter.get("/history", asyncHandler(async (req, res) => ok(res, await listMaintenance(req.user!.id, maintenanceQuerySchema.parse(req.query)))));
maintenanceRouter.get("/stats", asyncHandler(async (req, res) => ok(res, await getMaintenanceStats(req.user!.id))));
maintenanceRouter.post("/", asyncHandler(async (req, res) => ok(res, await createMaintenance(req.user!.id, maintenanceCreateSchema.parse(req.body)), 201)));
