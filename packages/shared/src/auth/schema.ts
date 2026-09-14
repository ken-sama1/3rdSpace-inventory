import z from "zod";
import type { UserDto } from "../users/types.js";
import type { ResponseBody } from "../Response.js";

// --- Register ---
export const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterResult = UserDto;
export type RegisterResBody = ResponseBody<RegisterResult>;

// --- Login ---
export const loginSchema = registerSchema;
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResult = UserDto;
export type LoginResBody = ResponseBody<RegisterResult>;
