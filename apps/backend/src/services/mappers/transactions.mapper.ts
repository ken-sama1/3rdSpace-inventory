import type { TransactionDto } from "@repo/shared";
import type { TransactionWithTransactionItems } from "../types/TransactionWithTransactionItems.js";

export const toTransactionDto = ({
  id,
  createdAt,
  totalPrice,
  transactionItems,
}: TransactionWithTransactionItems): TransactionDto => {
  return {
    id,
    totalPrice,
    createdAt: createdAt.toISOString(),
    transactionItems: transactionItems.map((ti) => {
      return {
        id: ti.id,
        productName: ti.productName,
        quantity: ti.quantity,
        unitPrice: ti.unitPrice,
        productId: ti.productId,
      };
    }),
  };
};
