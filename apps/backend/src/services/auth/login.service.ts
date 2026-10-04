import { prisma } from "@repo/database";
import type { LoginResult, LoginSchema } from "@repo/shared";
import * as bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_SECRET,
  EXPIRES_AT_30D_FDATE,
  REFRESH_TOKEN_SECRET,
} from "../../constants.js";
import { AppError } from "../../errors/AppError.js";

import type { AuthJwtPayload } from "../types/AuthJwtPayload.js";
import { hashToken } from "../utils/hashToken.util.js";
import { signJwtToken } from "../utils/sign-jwt-token.util.js";
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

  const pwdMatched = await bcrypt.compare(password, passwordHash);

  if (!user || !pwdMatched) {
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
    role: user.role,
  };

  const accessToken = signJwtToken(tokenPayload, "access");

  const refreshToken = signJwtToken(tokenPayload, "refresh");

  await prisma.userSession.create({
    data: {
      expiresAt: EXPIRES_AT_30D_FDATE,
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
