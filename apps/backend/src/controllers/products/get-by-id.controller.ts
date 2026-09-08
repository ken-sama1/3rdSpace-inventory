import type { GetProductByIdResBody, IdParamSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const getById = async (
  req: Request<IdParamSchema>,
  res: Response<GetProductByIdResBody>
): Promise<void> => {
  const result = await productsService.getById(req.params.id);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
