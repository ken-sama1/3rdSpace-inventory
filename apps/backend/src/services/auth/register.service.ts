import { prisma } from "@repo/database";
import type { RegisterResult, RegisterSchema } from "@repo/shared";
import bcrypt from "bcrypt";
import { SALT } from "../../config/constants.js";

export const register = async ({
  username,
  password,
}: RegisterSchema): Promise<RegisterResult> => {
  const hashedPwd = await bcrypt.hash(password, SALT);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPwd,
    },
  });

  return {
    id: user.id,
    username: user.username,
    // role: user.role,
  };
};
