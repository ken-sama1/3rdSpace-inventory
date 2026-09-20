import z from "zod";
import type { ResponseBody } from "../Response.js";
import type { UserDto } from "../users/types.js";
import type { AuthDto } from "./tupes.js";

// --- Register ---
export const registerSchema = z.object({
  username: z.string().min(3, "Username must not be less than 3 letters"),
  password: z.string().min(6, "Password must not be less that 6 letters"),
});
export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterResult = UserDto;
export type RegisterResBody = ResponseBody<RegisterResult>;

// --- Login ---
export const loginSchema = registerSchema;
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResult = AuthDto;
export type LoginResBody = ResponseBody<LoginResult>;

// --- Refresh ---
export type RefreshResult = AuthDto;
export type RefreshResBody = ResponseBody<RefreshResult>;
