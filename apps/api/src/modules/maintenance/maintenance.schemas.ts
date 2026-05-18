import { z } from "zod";
import { MAINTENANCE_CATEGORIES } from "../../utils/maintenance-rules.js";

export const maintenanceCreateSchema = z.object({
  vehicleId: z.string().min(1),
  category: z.enum(MAINTENANCE_CATEGORIES),
  customCategory: z.string().min(1).optional(),
  performedAt: z.string().datetime(),
  mileage: z.number().int().min(0),
  cost: z.number().min(0).default(0),
  garageName: z.string().optional(),
  notes: z.string().optional(),
  partsReplaced: z.array(z.string()).default([])
});

export const maintenanceQuerySchema = z.object({
  vehicleId: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).default(50),
  skip: z.coerce.number().int().min(0).default(0)
});
