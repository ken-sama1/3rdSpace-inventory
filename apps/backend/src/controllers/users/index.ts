import { getMe } from "./get-me.controller.js";
import { list } from "./list.controller.js";
import { updateMe } from "./update-me.controller.js";

export const usersController = {
  getMe,
  updateMe,
  list,
};
