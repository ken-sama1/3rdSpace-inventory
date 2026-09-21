import { prisma } from "@repo/database";
import type { LoginResult, LoginSchema } from "@repo/shared";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";

import type { AuthJwtPayload } from "../types/AuthJwtPayload.js";
import { hashToken } from "../utils/hashToken.util.js";
import type { WithResfreshToken } from "./types.js";

export const login = async ({
  username,
  password,
}: LoginSchema): Promise<WithResfreshToken<LoginResult>> => {
  const DUMMY_PASSWORD_HASH =
    "$2b$10$yeFqxmBrZ3Q2vL1hzkynBuYNwuNHeD/tsEIdNQcocDJmk4oxwuQQe";

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH;

  const passwordValid = await bcrypt.compare(password, passwordHash);

  if (!user || !passwordValid) {
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid username or password",
    });
  }

  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET)
    throw new AppError({
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

  const tokenPayload: AuthJwtPayload = {
    userId: user.id,
  };

  const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.userSession.create({
    data: {
      expiresAt,
      isRevoked: false,
      token: hashToken(refreshToken),
      userId: user.id,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};
