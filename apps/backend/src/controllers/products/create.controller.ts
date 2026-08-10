import type { CreateProductResBody, CreateProductSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const create = async (
  req: Request<{}, {}, CreateProductSchema>,
  res: Response<CreateProductResBody>
): Promise<void> => {
  const result = await productsService.create(req.body);

  res.status(201).json({
    message: "Item successfully created",
    data: result,
  });
};
