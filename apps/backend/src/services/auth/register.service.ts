import { prisma } from "@repo/database";
import type { RegisterResult, RegisterSchema } from "@repo/shared";
import * as bcrypt from "bcrypt";
import { SALT } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";

export const register = async ({
  username,
  password,
}: RegisterSchema): Promise<RegisterResult> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    throw new AppError({
      code: "CONFLICT",
      message: "Username already taken",
    });
  }

  const hashedPwd = await bcrypt.hash(password, SALT);

  const result = await prisma.user.create({
    data: {
      username,
      password: hashedPwd,
    },
  });

  return {
    id: result.id,
    username: result.username,
    // role: user.role,
  };
};
