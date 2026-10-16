import { prisma } from "@repo/database";
import type {
  GetUsersResult,
  UserFilterSchema,
  UserOptionsSchema,
} from "@repo/shared";
import { toUserDto } from "../mappers/user.mapper.js";
import { toStringFilter } from "../mappers/filter.mapper.js";

export const list = async (
  filter: UserFilterSchema = {},
  options: UserOptionsSchema = {}
): Promise<GetUsersResult> => {
  const { role, username, userId } = filter;
  const {
    lastUserId = null,
    order = "asc",
    sortBy = "username",
    limit = null,
  } = options;
  const users = await prisma.user.findMany({
    where: {
      ...(userId && { id: userId }),
      ...(username && {
        username: {
          ...toStringFilter(username),
          mode: "insensitive",
        },
      }),
      ...(role && {
        role,
      }),
    },
    orderBy: {
      [sortBy]: order,
    },
    ...(lastUserId && {
      cursor: {
        id: lastUserId,
      },
    }),

    ...(limit && { take: limit }),
  });

  return users.map(toUserDto);
};
