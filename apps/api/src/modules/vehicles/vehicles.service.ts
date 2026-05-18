import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/http.js";
import type { mileageUpdateSchema, vehicleCreateSchema, vehicleUpdateSchema } from "./vehicle.schemas.js";
import type { z } from "zod";

export function listVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { reminders: { where: { status: "planned" }, take: 3, orderBy: [{ dueDate: "asc" }] } }
  });
}

export async function getVehicle(userId: string, id: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, userId },
    include: {
      mileageLogs: { orderBy: { notedAt: "desc" }, take: 12 },
      records: { orderBy: { performedAt: "desc" }, take: 20 },
      reminders: { orderBy: [{ dueDate: "asc" }, { dueMileage: "asc" }] }
    }
  });
  if (!vehicle) throw new HttpError(404, "Vehicle not found");
  return vehicle;
}

export async function createVehicle(userId: string, input: z.infer<typeof vehicleCreateSchema>) {
  return prisma.vehicle.create({
    data: {
      ...input,
      userId,
      mileageLogs: { create: { mileage: input.currentMileage } }
    }
  });
}

export async function updateVehicle(userId: string, id: string, input: z.infer<typeof vehicleUpdateSchema>) {
  await ensureVehicleOwner(userId, id);
  return prisma.vehicle.update({ where: { id }, data: input });
}

export async function removeVehicle(userId: string, id: string) {
  await ensureVehicleOwner(userId, id);
  await prisma.vehicle.delete({ where: { id } });
  return { deleted: true };
}

export async function updateMileage(userId: string, vehicleId: string, input: z.infer<typeof mileageUpdateSchema>) {
  await ensureVehicleOwner(userId, vehicleId);
  return prisma.$transaction([
    prisma.vehicle.update({ where: { id: vehicleId }, data: { currentMileage: input.mileage } }),
    prisma.mileageLog.create({
      data: { vehicleId, mileage: input.mileage, notedAt: input.notedAt ? new Date(input.notedAt) : new Date() }
    })
  ]);
}

async function ensureVehicleOwner(userId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, userId }, select: { id: true } });
  if (!vehicle) throw new HttpError(404, "Vehicle not found");
}
