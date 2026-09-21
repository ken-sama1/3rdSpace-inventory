import { changePassword } from "./change-password.service.js";
import { getMe } from "./get-me.service.js";
import { updateMe } from "./update-me.service.js";

export const usersService = {
  getMe,
  changePassword,
  updateMe,
};
