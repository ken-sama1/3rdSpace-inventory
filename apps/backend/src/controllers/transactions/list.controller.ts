import {
  getTransactionsReqQuerySchema,
  validateSchema,
  type GetTransactionsReqQueryInput,
  type GetTransactionsResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { transactionsService } from "../../services/transactions/index.js";

export const list = async (
  req: Request<
    object,
    GetTransactionsResBody,
    object,
    GetTransactionsReqQueryInput
  >,
  res: Response<GetTransactionsResBody>
): Promise<void> => {
  const query = validateSchema(getTransactionsReqQuerySchema, req.query);

  const result = await transactionsService.list(query.filter, query.options);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
