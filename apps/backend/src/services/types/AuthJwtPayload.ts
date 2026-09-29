import type { JwtPayload } from "jsonwebtoken";
import type { UserRoleSchema } from "@repo/shared";

export interface AuthJwtPayload {
  userId: string;
  role: UserRoleSchema;
}

export interface AuthDecodedJwtPayload extends AuthJwtPayload, JwtPayload {}
