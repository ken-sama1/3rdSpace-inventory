import { prisma } from "@repo/database";
import bcrypt from "bcrypt";
import type { LoginResult, LoginSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../config/constants.js";
import type { JwtPayload } from "../types/JwtPayload.js";

export const login = async ({
  username,
  password,
}: LoginSchema): Promise<LoginResult & { refreshToken: string }> => {
  const DUMMY_PASSWORD_HASH =
    "$2b$10$yeFqxmBrZ3Q2vL1hzkynBuYNwuNHeD/tsEIdNQcocDJmk4oxwuQQe.....";

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
      message: "Missing socret token",
    });

  const tokenPayload: JwtPayload = {
    userId: user.id,
  };

  const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    accessToken,
    refreshToken,
  };
};
