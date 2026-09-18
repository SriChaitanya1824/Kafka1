import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { env } from "../config/env.js";
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: err.errors.map((e) => e.message).join(", ") } });
  if (err instanceof AppError) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
  return res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: env.NODE_ENV === "production" ? "Internal server error" : err.message } });
};
