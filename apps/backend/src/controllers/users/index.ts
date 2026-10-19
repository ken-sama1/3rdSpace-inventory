import { changePassword } from "./change-password.controller.js";
import { getMe } from "./get-me.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { resetPassword } from "./reset-password.controller.js";
import { updateMe } from "./update-me.controller.js";
import { update } from "./update.controller.js";

export const usersController = {
  getMe,
  updateMe,
  list,
  update,
  delete: remove,
  changePassword,
  resetPassword,
};
