import { validateSchema } from "@repo/shared";
import type { NextFunction, Request, Response } from "express";
import { ZodObject, type output } from "zod";

export const validateReqBody = <T extends ZodObject>(schema: T) => {
  return (
    req: Request<{}, {}, output<T>>,
    _: Response,
    next: NextFunction
  ): void => {
    try {
      req.body = validateSchema<T>(schema, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateReqParams = <T extends ZodObject>(schema: T) => {
  return (req: Request<output<T>>, _: Response, next: NextFunction): void => {
    try {
      req.params = validateSchema<T>(schema, req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};
