import { Router } from "express";
import multer from "multer";
import { prisma } from "../../db/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError, ok } from "../../utils/http.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(new HttpError(422, "Unsupported file type"));
      return;
    }
    cb(null, true);
  }
});

export const filesRouter = Router();
filesRouter.use(requireAuth);

filesRouter.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(422, "File is required");
    const storageKey = `${req.user!.id}/${Date.now()}-${req.file.originalname}`;
    const file = await prisma.uploadedFile.create({
      data: {
        userId: req.user!.id,
        vehicleId: req.body.vehicleId,
        maintenanceRecordId: req.body.maintenanceRecordId,
        type: req.body.type ?? "other",
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        storageKey
      }
    });
    return ok(res, file, 201);
  })
);
