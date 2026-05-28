import type { NextFunction, Request, Response } from "express";
import { toHttpError } from "../utils/http.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const httpError = toHttpError(error);
  if (httpError.status >= 500) {
    console.error(error);
    req.app.emit("error", error);
  }

  res.status(httpError.status).json({
    error: {
      message: httpError.message,
      details: httpError.details
    }
  });
}
