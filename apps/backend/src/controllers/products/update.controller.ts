import type {
  IdParam,
  UpdateProductResBody,
  UpdateProductSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const update = async (
  req: Request<IdParam, UpdateProductResBody, UpdateProductSchema>,
  res: Response<UpdateProductResBody>
): Promise<void> => {
  const result = await productsService.update(req.params.id, req.body);

  res.status(200).json({
    message: "Product successfully updated",
    data: result,
  });
};
