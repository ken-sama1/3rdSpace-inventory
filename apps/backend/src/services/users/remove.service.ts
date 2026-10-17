import { prisma } from "@repo/database";
import type { DeleteUserResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toUserDto } from "../mappers/user.mapper.js";

export const remove = async (
  id: IdSchema,
  requestingUserId: IdSchema
): Promise<DeleteUserResult> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new AppError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  if (user.id === requestingUserId || user.role === "ADMIN") {
    throw new AppError({
      code: "FORBIDDEN_ERROR",
      message: "You cannot delete your own account or an admin account",
    });
  }

  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  return toUserDto(result);
};
