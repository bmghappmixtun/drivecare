import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/http.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas.js";
import { login, refresh, register } from "./auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => ok(res, await register(registerSchema.parse(req.body)), 201))
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => ok(res, await login(loginSchema.parse(req.body))))
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const body = refreshSchema.parse(req.body);
    return ok(res, await refresh(body.refreshToken));
  })
);
