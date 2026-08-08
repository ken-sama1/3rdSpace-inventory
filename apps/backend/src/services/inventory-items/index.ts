import { create } from "./create.service.js";
import { getById } from "./get-by-id.service.js";
import { list } from "./list.service.js";
import { remove } from "./remove.service.js";
import { update } from "./update.service.js";

export const inventoryItemsService = {
  create,
  update,
  delete: remove,
  list,
  getById,
};
