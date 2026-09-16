import type { JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload {
  userId: string;
}

export interface AuthDecodedJwtPayload extends AuthJwtPayload, JwtPayload {}
