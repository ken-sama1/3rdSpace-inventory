import z from "zod";
import type { UserDto } from "./types.js";
import type { ResponseBody } from "../Response.js";

// --- User Role ---
export const userRoleSchema = z.enum(["ADMIN", "STAFF", "MANAGER"]);
export type UserRoleSchema = z.infer<typeof userRoleSchema>;

// --- Get By Id ---
export type GetUserByIdResult = UserDto;
export type GetUserByIdResBody = ResponseBody<GetUserByIdResult>;

// --- Update ---
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must not be less than 3 letters")
    .optional(),
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type UpdateUserResult = UserDto;
export type UpdateUserResBody = ResponseBody<UpdateMeResult>;

// --- Get Me ---
export type GetMeResult = UserDto;
export type GetMeResBody = ResponseBody<GetMeResult>;

// --- Update Me ---
export const updateMeSchema = updateUserSchema;
export type UpdateMeSchema = z.infer<typeof updateMeSchema>;
export type UpdateMeInput = z.input<typeof updateMeSchema>;
export type UpdateMeResult = UserDto;
export type UpdateMeResBody = ResponseBody<UpdateMeResult>;

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
