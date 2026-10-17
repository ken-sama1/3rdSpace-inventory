import { getMe } from "./get-me.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { updateMe } from "./update-me.controller.js";
import { update } from "./update.controller.js";

export const usersController = {
  getMe,
  updateMe,
  list,
  update,
  delete: remove,
};
