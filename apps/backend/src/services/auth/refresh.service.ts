import { prisma } from "@repo/database";
import { type RefreshResult } from "@repo/shared";
import {
  ACCESS_TOKEN_SECRET,
  EXPIRES_AT_30D_FDATE,
  REFRESH_TOKEN_SECRET,
} from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthJwtPayload } from "../types/AuthJwtPayload.js";
import { decodeJwtPayload } from "../utils/decode-jwt-payload.util.js";
import { hashToken } from "../utils/hashToken.util.js";
import { signJwtToken } from "../utils/sign-jwt-token.util.js";
import type { WithResfreshToken } from "./types.js";

export const refresh = async (
  token: string
): Promise<WithResfreshToken<RefreshResult>> => {
  if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(token, REFRESH_TOKEN_SECRET);

  const session = await prisma.userSession.findUnique({
    where: {
      token: hashToken(token),
    },
    include: {
      user: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!session)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  if (decoded.userId !== session.userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token mismatch",
    });

  if (session.isRevoked)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Session has been revoked",
    });

  if (session.expiresAt < new Date())
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Session expired",
    });

  const payload: AuthJwtPayload = {
    userId: session.userId,
    role: session.user.role,
  };

  const accessToken = signJwtToken(payload, "access");
  const refreshToken = signJwtToken(payload, "refresh");

  await prisma.userSession.create({
    data: {
      token: hashToken(refreshToken),
      expiresAt: EXPIRES_AT_30D_FDATE,
      userId: decoded.userId,
      isRevoked: false,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};
