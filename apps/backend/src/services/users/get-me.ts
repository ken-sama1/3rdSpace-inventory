import { prisma } from "@repo/database";
import type { GetMeResult, IdSchema } from "@repo/shared";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/constants.js";
import { AppError } from "../../errors/AppError.js";
import { throwTokenError } from "../../errors/throw-token-error.js";
import type { JwtPayload } from "../types/JwtPayload.js";

export const getMe = async (accessToken: string): Promise<GetMeResult> => {
  let userId: IdSchema | null = null;

  try {
    if (!ACCESS_TOKEN_SECRET) {
      throw new AppError({
        message: "ACCESS_TOKEN_SECRET is missing",
        code: "INTERNAL_ERROR",
      });
    }
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;

    userId = decoded.userId;
  } catch (error) {
    throwTokenError(error);
  }

  if (!userId)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  const me = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!me)
    throw new AppError({
      message: "User not found",
      code: "NOT_FOUND",
    });

  return {
    id: me.id,
    username: me.username,
    role: me.role,
  };
};
