import type { IdSchema } from "../common/schema.js";
import type { UserRoleSchema } from "./schema.js";

export interface UserDto {
  id: IdSchema;
  username: string;
  role: UserRoleSchema;
}
