import type { JwtPayload } from "jsonwebtoken";

export type WithResfreshToken<T> = T & {
  refreshToken: string;
};

export interface AuthJwtPayload {
  userId: string;
}

export interface AuthVerifiedJwtPayload extends AuthJwtPayload, JwtPayload {}
