import { prisma } from "@repo/database";
import type { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { AppError } from "../errors/AppError.js";
import { decodeJwtPayload } from "../services/utils/decode-jwt-payload.util.js";

export const authJwt = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Authentication required",
    });

  const [scheme, accessToken] = authorization.split(" ");

  if (scheme !== "Bearer" || !accessToken)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid authorization",
    });

  if (!ACCESS_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(accessToken, ACCESS_TOKEN_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    select: {
      id: true,
    },
  });

  if (!user)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token mismatch",
    });

  req.auth = {
    userId: user.id,
  };

  next();
};
