import type { IdSchema } from "../common/schema.js";

interface TransactionItem {
  id: IdSchema;
  productId: IdSchema;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface TransactionDto {
  id: IdSchema;
  createdAt: string;
  totalPrice: number;
  transactionItems: TransactionItem[];
}
