import type { Locale } from "./config";

export const messages: Record<Locale, Record<string, string>> = {
  fr: {
    dashboard: "Tableau de bord",
    vehicles: "Vehicules",
    maintenance: "Entretien",
    reminders: "Rappels",
    expenses: "Depenses",
    profile: "Profil"
  },
  en: {
    dashboard: "Dashboard",
    vehicles: "Vehicles",
    maintenance: "Maintenance",
    reminders: "Reminders",
    expenses: "Expenses",
    profile: "Profile"
  },
  ar: {
    dashboard: "لوحة التحكم",
    vehicles: "المركبات",
    maintenance: "الصيانة",
    reminders: "التنبيهات",
    expenses: "المصاريف",
    profile: "الملف الشخصي"
  }
};

export function t(locale: Locale, key: string) {
  return messages[locale]?.[key] ?? messages.fr[key] ?? key;
}
