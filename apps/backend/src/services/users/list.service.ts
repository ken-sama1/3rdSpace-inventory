import { prisma } from "@repo/database";
import type {
  GetUsersResult,
  UserFilterSchema,
  UserOptionsSchema,
} from "@repo/shared";
import { toUserDto } from "../mappers/user.mapper.js";

export const list = async (
  filter: UserFilterSchema = {},
  options: UserOptionsSchema = {}
): Promise<GetUsersResult> => {
  const {} = filter;
  const { lastUserId = null, order = "asc", sortBy = "username" } = options;
  const users = await prisma.user.findMany({
    where: {},
    orderBy: {
      [sortBy]: order,
    },
    ...(lastUserId && {
      cursor: {
        id: lastUserId,
      },
    }),
  });

  return users.map(toUserDto);
};
