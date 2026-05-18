import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/http.js";
import { calculateNextMaintenance } from "../../utils/maintenance-rules.js";
import type { maintenanceCreateSchema, maintenanceQuerySchema } from "./maintenance.schemas.js";
import type { z } from "zod";

export async function createMaintenance(userId: string, input: z.infer<typeof maintenanceCreateSchema>) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id: input.vehicleId, userId } });
  if (!vehicle) throw new HttpError(404, "Vehicle not found");

  const schedule = calculateNextMaintenance({
    category: input.category,
    performedAt: new Date(input.performedAt),
    mileage: input.mileage
  });

  return prisma.$transaction(async (tx: typeof prisma) => {
    const record = await tx.maintenanceRecord.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        category: input.category,
        customCategory: input.customCategory,
        performedAt: new Date(input.performedAt),
        mileage: input.mileage,
        cost: input.cost,
        garageName: input.garageName,
        notes: input.notes,
        partsReplaced: input.partsReplaced
      }
    });

    await tx.expense.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        maintenanceRecordId: record.id,
        label: input.customCategory ?? input.category,
        amount: input.cost,
        spentAt: new Date(input.performedAt)
      }
    });

    if (schedule.dueDate || schedule.dueMileage) {
      await tx.reminder.create({
        data: {
          userId,
          vehicleId: input.vehicleId,
          maintenanceRecordId: record.id,
          category: input.category,
          title: `Prochain entretien: ${input.customCategory ?? input.category}`,
          dueDate: schedule.dueDate,
          dueMileage: schedule.dueMileage
        }
      });
    }

    if (input.mileage > vehicle.currentMileage) {
      await tx.vehicle.update({ where: { id: vehicle.id }, data: { currentMileage: input.mileage } });
      await tx.mileageLog.create({ data: { vehicleId: vehicle.id, mileage: input.mileage } });
    }

    return record;
  });
}

export function listMaintenance(userId: string, query: z.infer<typeof maintenanceQuerySchema>) {
  return prisma.maintenanceRecord.findMany({
    where: { userId, vehicleId: query.vehicleId },
    include: { files: true },
    orderBy: { performedAt: "desc" },
    take: query.take,
    skip: query.skip
  });
}

export async function getMaintenanceStats(userId: string) {
  const [expenses, records, upcoming] = await Promise.all([
    prisma.expense.findMany({ where: { userId } }),
    prisma.maintenanceRecord.count({ where: { userId } }),
    prisma.reminder.count({ where: { userId, status: "planned" } })
  ]);

  type ExpenseRow = { spentAt: Date; amount: unknown };
  const expenseRows = expenses as ExpenseRow[];

  const annualCost = expenseRows
    .filter((expense: ExpenseRow) => expense.spentAt.getFullYear() === new Date().getFullYear())
    .reduce((sum: number, expense: ExpenseRow) => sum + Number(expense.amount), 0);

  const monthlyCost = expenseRows.reduce<Record<string, number>>((acc: Record<string, number>, expense: ExpenseRow) => {
    const key = expense.spentAt.toISOString().slice(0, 7);
    acc[key] = (acc[key] ?? 0) + Number(expense.amount);
    return acc;
  }, {});

  return { records, upcoming, annualCost, monthlyCost };
}
