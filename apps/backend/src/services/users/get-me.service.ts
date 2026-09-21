import { prisma } from "@repo/database";
import type { GetMeResult } from "@repo/shared";
import { ACCESS_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import { decodeJwtPayload } from "../utils/decode-jwt-payload.util.js";

export const getMe = async (accessToken: string): Promise<GetMeResult> => {
  if (!ACCESS_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(accessToken, ACCESS_TOKEN_SECRET);

  if (!decoded.userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  const me = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!me)
    throw new AppError({
      message: "User not found",
      code: "NOT_FOUND",
    });

  return {
    id: me.id,
    username: me.username,
    // role: me.role,
  };
};
