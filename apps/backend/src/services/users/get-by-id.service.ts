import { prisma } from "@repo/database";
import type { GetUserByIdResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toUserDto } from "../mappers/user.mapper.js";

export const getById = async (id: IdSchema): Promise<GetUserByIdResult> => {
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

  return toUserDto(user);
};
