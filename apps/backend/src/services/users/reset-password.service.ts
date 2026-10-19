import { prisma } from "@repo/database";
import type { IdSchema, ResetPasswordSchema } from "@repo/shared";
import * as bcrypt from "bcrypt";
import { SALT } from "../../constants.js";

export const resetPassword = async (
  id: IdSchema,
  { newPassword }: ResetPasswordSchema
): Promise<void> => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: await bcrypt.hash(newPassword, SALT),
    },
  });
};
