import type { Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}

export function toHttpError(error: unknown) {
  if (error instanceof HttpError) return error;
  if (error instanceof ZodError) return new HttpError(422, "Validation failed", error.flatten());
  return new HttpError(500, "Internal server error");
}
