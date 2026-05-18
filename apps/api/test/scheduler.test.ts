import { calculateNextMaintenance, getMaintenanceUrgency } from "@drivecare/shared";
import { describe, expect, it } from "vitest";

describe("maintenance scheduler", () => {
  it("calculates next oil change by date and mileage", () => {
    const result = calculateNextMaintenance({
      category: "oil_change",
      performedAt: new Date("2026-01-01T00:00:00.000Z"),
      mileage: 42000
    });

    expect(result.dueMileage).toBe(52000);
    expect(result.dueDate?.toISOString().slice(0, 10)).toBe("2027-01-01");
  });

  it("marks overdue reminders", () => {
    expect(
      getMaintenanceUrgency({
        currentMileage: 61000,
        dueMileage: 60000,
        now: new Date("2026-01-01T00:00:00.000Z")
      })
    ).toBe("overdue");
  });
});
