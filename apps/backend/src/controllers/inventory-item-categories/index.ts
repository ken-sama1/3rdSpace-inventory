import { assignItems } from "./assign-items.controller.js";
import { create } from "./create.controller.js";
import { getById } from "./get-by-id.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { unassignItems } from "./unassign-items.controller.js";
import { update } from "./update.controller.js";

export const inventoryItemCategoriesController = {
  create,
  list,
  getById,
  delete: remove,
  update,
  assignItems,
  unassignItems,
};
