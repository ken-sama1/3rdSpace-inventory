import { prisma } from "@repo/database";
import type {
  IdSchema,
  UpdateUserResult,
  UpdateUserSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";

export const update = async (
  id: IdSchema,
  { username }: UpdateUserSchema
): Promise<UpdateUserResult> => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...(username && { username }),
    },
  });

  if (!user)
    throw new AppError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  return {
    username: user.username,
    id: user.id,
  };
};
