import { prisma } from "@repo/database";
import type {
  GetTransactionsResult,
  TransactionFilterSchema,
  TransactionOptionsSchema,
} from "@repo/shared";
import { toDateFilter, toNumberFilter } from "../mappers/filter.mapper.js";
import { toTransactionDto } from "../mappers/transactions.mapper.js";

export const list = async (
  filter: TransactionFilterSchema = {},
  options: TransactionOptionsSchema = {}
): Promise<GetTransactionsResult> => {
  const { createdAt, totalPrice } = filter;
  const {
    lastTransactionId,
    order = "desc",
    sortBy = "createdAt",
    limit = null,
  } = options;

  const transactions = await prisma.transaction.findMany({
    where: {
      ...(createdAt && {
        createdAt: toDateFilter(createdAt),
      }),
      ...(totalPrice && {
        totalPrice: toNumberFilter(totalPrice),
      }),
    },
    orderBy: {
      [sortBy]: order,
    },
    ...(lastTransactionId && {
      cursor: {
        id: lastTransactionId,
      },
      skip: 1,
    }),
    include: {
      transactionItems: true,
    },
    ...(options.limit && { take: options.limit }),
    ...(limit && { take: limit }),
  });

  return transactions.map(toTransactionDto);
};
