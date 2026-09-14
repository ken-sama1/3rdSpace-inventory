import type { UserDto } from "../users/types.js";

export interface AuthDto extends UserDto {
  accessToken: string;
}
