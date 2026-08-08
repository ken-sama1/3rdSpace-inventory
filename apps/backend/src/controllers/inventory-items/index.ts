import { create } from "./create.controller.js";
import { getById } from "./get-by-id.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { update } from "./update.controller.js";

export const inventoryItemsController = {
  create,
  update,
  delete: remove,
  list,
  getById,
};
