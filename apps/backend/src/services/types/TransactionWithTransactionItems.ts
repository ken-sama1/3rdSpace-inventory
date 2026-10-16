import type { TransactionItem, Transaction } from "@repo/database";

export interface TransactionWithTransactionItems extends Transaction {
  transactionItems: TransactionItem[];
}
