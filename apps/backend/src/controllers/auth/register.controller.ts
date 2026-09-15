import type { RegisterResBody, RegisterSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { authService } from "../../services/auth/index.js";

export const register = async (
  req: Request<{}, RegisterResBody, RegisterSchema>,
  res: Response<RegisterResBody>
): Promise<void> => {
  const result = await authService.register(req.body);

  res.status(201).json({
    data: result,
    message: "Account created successfully",
  });
};
