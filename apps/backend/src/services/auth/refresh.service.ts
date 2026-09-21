import { prisma } from "@repo/database";
import { type RefreshResult } from "@repo/shared";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthJwtPayload } from "../types/AuthJwtPayload.js";
import { decodeJwtPayload } from "../utils/decode-jwt-payload.util.js";
import type { WithResfreshToken } from "./types.js";
import { hashToken } from "../utils/hashToken.util.js";

export const refresh = async (
  token: string
): Promise<WithResfreshToken<RefreshResult>> => {
  if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(token, REFRESH_TOKEN_SECRET);

  const user = await prisma.userSession.findUnique({
    where: {
      token: hashToken(token),
    },
  });

  if (!user)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  if (decoded.userId !== user.userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token mismatch",
    });

  if (user.isRevoked)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Session has been revoked",
    });

  if (user.expiresAt < new Date())
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Session expeired",
    });

  const payload: AuthJwtPayload = {
    userId: user.userId,
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);

  return {
    accessToken,
    refreshToken,
  };
};
