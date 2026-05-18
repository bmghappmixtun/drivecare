export const vehicles = [
  { id: "1", brand: "Tesla", model: "Model 3", year: 2023, mileage: 28600, plate: "AA-123-BB", status: "ok" },
  { id: "2", brand: "Volkswagen", model: "Golf", year: 2019, mileage: 81200, plate: "TU-9182", status: "soon" }
];

export const reminders = [
  { title: "Vidange", vehicle: "Volkswagen Golf", due: "Dans 320 km", urgency: "soon" },
  { title: "Assurance", vehicle: "Tesla Model 3", due: "24 juin 2026", urgency: "ok" },
  { title: "Controle technique", vehicle: "Volkswagen Golf", due: "En retard", urgency: "overdue" }
];

export const expenses = [
  { month: "Jan", cost: 120 },
  { month: "Fev", cost: 0 },
  { month: "Mar", cost: 430 },
  { month: "Avr", cost: 85 },
  { month: "Mai", cost: 210 },
  { month: "Juin", cost: 0 }
];

export const history = [
  { label: "Plaquettes avant", vehicle: "Golf", date: "2026-05-04", cost: 180 },
  { label: "Filtres + huile", vehicle: "Model 3", date: "2026-04-15", cost: 95 },
  { label: "Pneus ete", vehicle: "Golf", date: "2026-03-22", cost: 430 }
];
