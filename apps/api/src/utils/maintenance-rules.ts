export const VEHICLE_FUEL_TYPES = [
  "gasoline",
  "diesel",
  "hybrid",
  "electric",
  "lpg",
  "other"
] as const;

export const TRANSMISSION_TYPES = ["manual", "automatic", "cvt", "other"] as const;

export const MAINTENANCE_CATEGORIES = [
  "oil_change",
  "filters",
  "tires",
  "battery",
  "brakes",
  "timing_belt",
  "air_conditioning",
  "insurance",
  "technical_inspection",
  "repair",
  "custom"
] as const;

export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number];

const RULES: Partial<Record<MaintenanceCategory, { intervalKm?: number; intervalMonths?: number }>> = {
  oil_change: { intervalKm: 10000, intervalMonths: 12 },
  filters: { intervalKm: 15000, intervalMonths: 12 },
  tires: { intervalKm: 40000, intervalMonths: 48 },
  brakes: { intervalKm: 30000, intervalMonths: 24 },
  timing_belt: { intervalKm: 60000, intervalMonths: 60 },
  technical_inspection: { intervalMonths: 24 },
  insurance: { intervalMonths: 12 }
};

export function calculateNextMaintenance(input: {
  category: MaintenanceCategory;
  performedAt: Date;
  mileage: number;
}) {
  const rule = RULES[input.category];
  if (!rule) return {};

  return {
    dueDate: rule.intervalMonths ? addMonths(input.performedAt, rule.intervalMonths) : undefined,
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
