import type { Response, Request } from "express";
import { productsService } from "../../services/products/index.js";

export const create = async (req: Request, res: Response) => {
  const result = await productsService.create(req.body);

  res.status(201).json(result);
};
