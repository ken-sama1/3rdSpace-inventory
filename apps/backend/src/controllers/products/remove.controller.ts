import type { DeleteProductResBody, IdParamSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const remove = async (
  req: Request<IdParamSchema>,
  res: Response<DeleteProductResBody>
): Promise<void> => {
  const result = await productsService.delete(req.params.id);

  res.status(200).json({
    message: "Product successfully deleted",
    data: result,
  });
};
