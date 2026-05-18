import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";
import { createVehicle, getVehicle, listVehicles, removeVehicle, updateMileage, updateVehicle } from "./vehicles.service.js";
import { mileageUpdateSchema, vehicleCreateSchema, vehicleUpdateSchema } from "./vehicle.schemas.js";

export const vehiclesRouter = Router();
vehiclesRouter.use(requireAuth);

vehiclesRouter.get("/", asyncHandler(async (req, res) => ok(res, await listVehicles(req.user!.id))));
vehiclesRouter.post("/", asyncHandler(async (req, res) => ok(res, await createVehicle(req.user!.id, vehicleCreateSchema.parse(req.body)), 201)));
vehiclesRouter.get("/:id", asyncHandler(async (req, res) => ok(res, await getVehicle(req.user!.id, req.params.id))));
vehiclesRouter.put("/:id", asyncHandler(async (req, res) => ok(res, await updateVehicle(req.user!.id, req.params.id, vehicleUpdateSchema.parse(req.body)))));
vehiclesRouter.delete("/:id", asyncHandler(async (req, res) => ok(res, await removeVehicle(req.user!.id, req.params.id))));
vehiclesRouter.post("/:id/mileage", asyncHandler(async (req, res) => ok(res, await updateMileage(req.user!.id, req.params.id, mileageUpdateSchema.parse(req.body)))));
