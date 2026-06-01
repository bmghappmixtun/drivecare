export const VEHICLE_CATALOG = [
  { brand: "Alfa Romeo", models: ["Giulia", "Giulietta", "MiTo", "Stelvio", "Tonale"] },
  { brand: "Audi", models: ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "e-tron"] },
  { brand: "BMW", models: ["Serie 1", "Serie 2", "Serie 3", "Serie 5", "X1", "X3", "X5", "i3", "i4", "iX"] },
  { brand: "Citroen", models: ["C1", "C3", "C3 Aircross", "C4", "C4 Cactus", "C5 Aircross", "Berlingo"] },
  { brand: "Dacia", models: ["Dokker", "Duster", "Jogger", "Logan", "Sandero", "Spring"] },
  { brand: "Fiat", models: ["500", "500X", "Doblo", "Panda", "Punto", "Tipo"] },
  { brand: "Ford", models: ["Fiesta", "Focus", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger"] },
  { brand: "Hyundai", models: ["i10", "i20", "i30", "Kona", "Santa Fe", "Tucson"] },
  { brand: "Kia", models: ["Ceed", "Niro", "Picanto", "Rio", "Sportage", "Stonic"] },
  { brand: "Mercedes-Benz", models: ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLC", "GLE"] },
  { brand: "Nissan", models: ["Juke", "Leaf", "Micra", "Navara", "Qashqai", "X-Trail"] },
  { brand: "Peugeot", models: ["108", "208", "2008", "308", "3008", "508", "5008", "Partner", "Rifter"] },
  { brand: "Renault", models: ["Captur", "Clio", "Kadjar", "Kangoo", "Megane", "Scenic", "Talisman", "Zoe"] },
  { brand: "Seat", models: ["Arona", "Ateca", "Ibiza", "Leon", "Tarraco"] },
  { brand: "Skoda", models: ["Fabia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Superb"] },
  { brand: "Tesla", models: ["Model 3", "Model S", "Model X", "Model Y"] },
  { brand: "Toyota", models: ["Auris", "C-HR", "Corolla", "Hilux", "Prius", "RAV4", "Yaris", "Yaris Cross"] },
  { brand: "Volkswagen", models: ["Golf", "ID.3", "ID.4", "Passat", "Polo", "T-Cross", "T-Roc", "Tiguan", "Touran"] },
  { brand: "Volvo", models: ["S60", "V40", "V60", "XC40", "XC60", "XC90"] }
] as const;

export const VEHICLE_BRANDS = VEHICLE_CATALOG.map((item) => item.brand);

export function getVehicleModels(brand: string) {
  const normalizedBrand = brand.trim().toLowerCase();
  return VEHICLE_CATALOG.find((item) => item.brand.toLowerCase() === normalizedBrand)?.models ?? [];
}
