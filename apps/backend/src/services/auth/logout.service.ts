import { prisma } from "@repo/database";
import { REFRESH_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import { decodeJwtPayload } from "../utils/decode-jwt-payload.util.js";
import { hashToken } from "../utils/hashToken.util.js";

export const logout = async (token: string): Promise<void> => {
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

  if (!REFRESH_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const decoded = decodeJwtPayload(token, REFRESH_TOKEN_SECRET);

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
