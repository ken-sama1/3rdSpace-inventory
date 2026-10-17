import z from "zod";
import { baseOptionsSchema } from "../common/options-schema.js";
import { idSchema } from "../common/schema.js";
import type { ResponseBody } from "../Response.js";
import type { UserDto } from "./types.js";

export const userSortBySchema = z.enum(["username", "role", "createdAt"]);
// --- User Role ---
export const userRoleSchema = z.enum(["ADMIN", "STAFF", "MANAGER"]);
export type UserRoleSchema = z.infer<typeof userRoleSchema>;

// --- Filter ---
// Placeholder for now
export const userFilterSchema = z
  .object({
    role: userRoleSchema,
    username: z.string(),
    userId: idSchema,
  })
  .partial();
export type UserFilterSchema = z.infer<typeof userFilterSchema>;
export type UserFilterInput = z.input<typeof userFilterSchema>;

// --- Options ---
// Placeholder for now
export const userOptionsSchema = z
  .object({
    lastUserId: z.string(),
    sortBy: userSortBySchema,
  })
  .partial()
  .extend(baseOptionsSchema.shape);
export type UserOptionsSchema = z.infer<typeof userOptionsSchema>;
export type UserOptionsInput = z.input<typeof userOptionsSchema>;

// --- Get Users ---
export const getUsersReqQuerySchema = z
  .object({
    filter: userFilterSchema,
    options: userOptionsSchema,
  })
  .partial();
export type GetUserReqQuerySchema = z.infer<typeof getUsersReqQuerySchema>;
export type GetUserReqQueryInput = z.input<typeof getUsersReqQuerySchema>;
export type GetUsersResult = UserDto[];
export type GetUsersResBody = ResponseBody<GetUsersResult>;

// --- Get By Id ---
export type GetUserByIdResult = UserDto;
export type GetUserByIdResBody = ResponseBody<GetUserByIdResult>;

// --- Update ---
export const updateUserSchema = z
  .object({
    username: z.string().min(3, "Username must not be less than 3 letters"),
    role: userRoleSchema,
  })
  .partial();
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type UpdateUserResult = UserDto;
export type UpdateUserResBody = ResponseBody<UpdateUserResult>;

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

// --- Delete User ---
export type DeleteUserResult = UserDto;
export type DeleteUserResBody = ResponseBody<DeleteUserResult>;
