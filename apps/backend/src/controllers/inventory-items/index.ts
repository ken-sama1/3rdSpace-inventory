import { create } from "./create.controller.js";
import { getById } from "./get-by-id.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { stockIn } from "./stock-in.controller.js";
import { stockOut } from "./stock-out.controller.js";
import { update } from "./update.controller.js";

export const inventoryItemsController = {
  create,
  update,
  delete: remove,
  list,
  getById,
  stockIn,
  stockOut,
};
