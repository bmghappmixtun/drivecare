import { DEFAULT_MAINTENANCE_RULES, type MaintenanceCategory } from "./domain";

export type ScheduleInput = {
  category: MaintenanceCategory;
  performedAt: Date;
  mileage: number;
};

export type ScheduleResult = {
  dueDate?: Date;
  dueMileage?: number;
  intervalKm?: number;
  intervalMonths?: number;
};

export function calculateNextMaintenance(input: ScheduleInput): ScheduleResult {
  const rule = DEFAULT_MAINTENANCE_RULES.find((item) => item.category === input.category);
  if (!rule) return {};

  const dueDate = rule.intervalMonths
    ? addMonths(input.performedAt, rule.intervalMonths)
    : undefined;

  return {
    dueDate,
    dueMileage: rule.intervalKm ? input.mileage + rule.intervalKm : undefined,
    intervalKm: rule.intervalKm,
    intervalMonths: rule.intervalMonths
  };
}

export function getMaintenanceUrgency(params: {
  currentMileage: number;
  dueMileage?: number | null;
  dueDate?: Date | string | null;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const dueDate = params.dueDate ? new Date(params.dueDate) : null;
  const kmRemaining = params.dueMileage ? params.dueMileage - params.currentMileage : null;
  const daysRemaining = dueDate
    ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if ((kmRemaining !== null && kmRemaining <= 0) || (daysRemaining !== null && daysRemaining <= 0)) {
    return "overdue" as const;
  }
  if ((kmRemaining !== null && kmRemaining <= 500) || (daysRemaining !== null && daysRemaining <= 14)) {
    return "soon" as const;
  }
  return "ok" as const;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}
