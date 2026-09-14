import z from "zod";
import type { UserDto } from "./types.js";
import type { ResponseBody } from "../Response.js";

// --- User Role ---
export const userRoleSchema = z.enum(["ADMIN", "STAFF", "MANAGER"]);
export type UserRoleSchema = z.infer<typeof userRoleSchema>;

// --- Get Me ---
export type GetMeResult = UserDto;
export type GetMeResBody = ResponseBody<GetMeResult>;
