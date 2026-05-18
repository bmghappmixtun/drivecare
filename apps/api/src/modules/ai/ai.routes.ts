import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";

const aiSchema = z.object({
  vehicleId: z.string().optional(),
  prompt: z.string().min(5).max(2000)
});

export const aiRouter = Router();
aiRouter.use(requireAuth);

aiRouter.post(
  "/assistant",
  asyncHandler(async (req, res) => {
    const input = aiSchema.parse(req.body);
    const vehicle = input.vehicleId
      ? await prisma.vehicle.findFirst({ where: { id: input.vehicleId, userId: req.user!.id } })
      : null;

    const response = buildDiagnosticResponse(input.prompt, vehicle);
    const saved = await prisma.aiRequest.create({
      data: { userId: req.user!.id, vehicleId: input.vehicleId, prompt: input.prompt, response }
    });

    return ok(res, { id: saved.id, response });
  })
);

function buildDiagnosticResponse(prompt: string, vehicle: { brand: string; model: string; currentMileage: number } | null) {
  const lower = prompt.toLowerCase();
  const suggestions = [];
  if (lower.includes("frein") || lower.includes("brake") || lower.includes("metal")) {
    suggestions.push("Verifier l'usure des plaquettes et l'etat des disques.");
    suggestions.push("Controler le niveau et la couleur du liquide de frein.");
  }
  if (lower.includes("batterie") || lower.includes("start") || lower.includes("demarrage")) {
    suggestions.push("Tester la tension batterie et l'alternateur.");
  }
  if (lower.includes("huile") || lower.includes("oil")) {
    suggestions.push("Verifier niveau d'huile, filtre et date de derniere vidange.");
  }

  return {
    vehicleContext: vehicle ? `${vehicle.brand} ${vehicle.model}, ${vehicle.currentMileage} km` : null,
    riskLevel: suggestions.length > 1 ? "medium" : "low",
    suggestions: suggestions.length ? suggestions : ["Planifier un diagnostic garage si le symptome persiste."],
    disclaimer: "Cette aide ne remplace pas un diagnostic professionnel."
  };
}
