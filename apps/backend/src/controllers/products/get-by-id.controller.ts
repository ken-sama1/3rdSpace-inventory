import type { GetProductsByIdResBody, IdParam } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const getById = async (
  req: Request<IdParam>,
  res: Response<GetProductsByIdResBody>
): Promise<void> => {
  const result = await productsService.getById(req.params.id);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
