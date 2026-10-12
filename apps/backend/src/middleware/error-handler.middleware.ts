import { API_ERROR_CODE_TO_MESSAGE, type ResponseError } from "@repo/shared";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ResponseError>,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      code: "VALIDATION_ERROR",
    });

    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
      code: err.code,
    });

    return;
  }

  res.status(500).json({
    message: API_ERROR_CODE_TO_MESSAGE["INTERNAL_ERROR"],
    errors: [err],
    code: "INTERNAL_ERROR",
  });
};
