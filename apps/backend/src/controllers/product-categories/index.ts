import { assignProducts } from "./assign-products.controller.js";
import { create } from "./create.controller.js";
import { getById } from "./get-by-id.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { unassignProducts } from "./unassign-products.controller.js";
import { update } from "./update.controller.js";

export const productCategoriesController = {
  create,
  update,
  delete: remove,
  getById,
  list,
  unassignProducts,
  assignProducts,
};
