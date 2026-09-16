import { prisma } from "@repo/database";
import { hashToken } from "./utils.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthDecodedJwtPayload } from "../types/AuthJwtPayload.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../config/constants.js";
import { throwTokenError } from "../../errors/throw-token-error.js";

export const logout = async (token: string) => {
  const session = await prisma.userSession.findUnique({
    where: {
      token: hashToken(token),
    },
  });

  if (!session)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  let decoded!: AuthDecodedJwtPayload;

  try {
    if (!REFRESH_TOKEN_SECRET)
      throw new AppError({
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      });

    decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as AuthDecodedJwtPayload;
  } catch (error) {
    throwTokenError(error);
  }

  if (decoded.userId !== session.userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token mismatch",
    });

  await prisma.userSession.update({
    data: {
      isRevoked: true,
    },
    where: {
      id: session.id,
    },
  });
};
