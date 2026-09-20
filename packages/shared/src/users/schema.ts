import z from "zod";
import type { UserDto } from "./types.js";
import type { ResponseBody } from "../Response.js";

// --- User Role ---
export const userRoleSchema = z.enum(["ADMIN", "STAFF", "MANAGER"]);
export type UserRoleSchema = z.infer<typeof userRoleSchema>;

// --- Get Me ---
export type GetMeResult = UserDto;
export type GetMeResBody = ResponseBody<GetMeResult>;

// --- Change Password ---
export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, "Old password must not be less that 6 letters"),
  newPassword: z
    .string()
    .min(6, "New password must not be less that 6 letters"),
});
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;

// --- Update ---
export const updateUserSchema = z.object({
  username: z.string().min(3, "Username must not be less than 3 letters"),
});
