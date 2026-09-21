import { prisma } from "@repo/database";
import type { UpdateMeResult, UpdateMeSchema } from "@repo/shared";
import { REFRESH_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import { decodeJwtPayload } from "../utils/decode-jwt-payload.util.js";
import { hashToken } from "../utils/hashToken.util.js";

export const updateMe = async (
  refreshToken: string,
  { username }: UpdateMeSchema
): Promise<UpdateMeResult> => {
  if (!REFRESH_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(refreshToken, REFRESH_TOKEN_SECRET);

  const session = await prisma.userSession.findUnique({
    where: {
      id: hashToken(refreshToken),
    },
  });

  if (!session)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  if (session.isRevoked)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Session has been revoked",
    });

  if (session.userId !== decoded.userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token mismatch",
    });

  const result = await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      ...(username && { username }),
    },
  });

  return {
    id: result.id,
    username: result.username,
  };
};
