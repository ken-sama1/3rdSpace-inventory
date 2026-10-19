import { changePassword } from "./change-password.service.js";
import { getById } from "./get-by-id.service.js";
import { list } from "./list.service.js";
import { remove } from "./remove.service.js";
import { resetPassword } from "./reset-password.service.js";
import { update } from "./update.service.js";

export const usersService = {
  changePassword,
  resetPassword,
  getById,
  update,
  list,
  delete: remove,
};
