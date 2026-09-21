import { prisma } from "@repo/database";
import type { ChangePasswordSchema, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import * as bcrypt from "bcrypt";

export const changePassword = async (
  id: IdSchema,
  { oldPassword, newPassword }: ChangePasswordSchema
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user)
    throw new AppError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  const pwdMatched = await bcrypt.compare(oldPassword, user.password);

  if (!pwdMatched)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Incorrect password",
    });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: newPassword,
    },
  });
};
