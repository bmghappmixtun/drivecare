import { TRANSMISSION_TYPES, VEHICLE_FUEL_TYPES } from "@drivecare/shared";
import { z } from "zod";

export const vehicleCreateSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(2).optional(),
  vin: z.string().min(8).optional(),
  currentMileage: z.number().int().min(0),
  fuelType: z.enum(VEHICLE_FUEL_TYPES),
  transmission: z.enum(TRANSMISSION_TYPES),
  photoUrl: z.string().url().optional()
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export const mileageUpdateSchema = z.object({
  mileage: z.number().int().min(0),
  notedAt: z.string().datetime().optional()
});
