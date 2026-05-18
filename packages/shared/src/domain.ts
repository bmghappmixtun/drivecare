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

export const USER_ROLES = ["USER", "ADMIN"] as const;

export type VehicleFuelType = (typeof VEHICLE_FUEL_TYPES)[number];
export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];
export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export type MaintenanceRule = {
  category: MaintenanceCategory;
  label: Record<"fr" | "en" | "ar", string>;
  intervalKm?: number;
  intervalMonths?: number;
};

export const DEFAULT_MAINTENANCE_RULES: MaintenanceRule[] = [
  {
    category: "oil_change",
    label: { fr: "Vidange", en: "Oil change", ar: "تغيير الزيت" },
    intervalKm: 10000,
    intervalMonths: 12
  },
  {
    category: "filters",
    label: { fr: "Filtres", en: "Filters", ar: "الفلاتر" },
    intervalKm: 15000,
    intervalMonths: 12
  },
  {
    category: "tires",
    label: { fr: "Pneus", en: "Tires", ar: "الإطارات" },
    intervalKm: 40000,
    intervalMonths: 48
  },
  {
    category: "brakes",
    label: { fr: "Freins", en: "Brakes", ar: "الفرامل" },
    intervalKm: 30000,
    intervalMonths: 24
  },
  {
    category: "timing_belt",
    label: { fr: "Courroie", en: "Timing belt", ar: "حزام التوقيت" },
    intervalKm: 60000,
    intervalMonths: 60
  },
  {
    category: "technical_inspection",
    label: { fr: "Controle technique", en: "Technical inspection", ar: "الفحص الفني" },
    intervalMonths: 24
  },
  {
    category: "insurance",
    label: { fr: "Assurance", en: "Insurance", ar: "التأمين" },
    intervalMonths: 12
  }
];
