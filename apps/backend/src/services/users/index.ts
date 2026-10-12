import { changePassword } from "./change-password.service.js";
import { getById } from "./get-by-id.service.js";
import { list } from "./list.service.js";
import { update } from "./update.service.js";

export const usersService = {
  changePassword,
  getById,
  update,
  list,
};
