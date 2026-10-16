import { create } from "./create.controller.js";
import { deductStock } from "./deduct-stock.controller.js";
import { deductStocks } from "./deduct-stocks.controller.js";
import { getById } from "./get-by-id.controller.js";
import { list } from "./list.controller.js";
import { remove } from "./remove.controller.js";
import { update } from "./update.controller.js";

export const productsController = {
  create,
  list,
  delete: remove,
  update,
  deductStock,
  deductStocks,
  getById,
};
