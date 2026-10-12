import type { User } from "@repo/database";
import type { PartialSome, UserDto } from "@repo/shared";

export const toUserDto = ({
  id,
  role,
  username,
  createdAt,
}: PartialSome<User, "password">): UserDto => {
  return {
    id,
    role,
    username,
    createdAt: createdAt.toISOString(),
  };
};
