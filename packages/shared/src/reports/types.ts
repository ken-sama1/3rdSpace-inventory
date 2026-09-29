import type { ReportPeriodSchema } from "./schema.js";

interface Sale {
  date: string;
  totalSales: number;
  transactions: number;
}

interface TopProduct {
  productName: string;
  unitsSold: number;
  totalSales: number;
}

export interface TransactionDto {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  transactionPrice: number;
  createdAt: string;
}

export interface ReportSummaryDto {
  period: ReportPeriodSchema;
  summary: {
    totalSales: number;
    transactionCount: number;
    unitsSold: number;
    averageOrderValue: number;
  };
  salesByDay: Sale[];
  topProducts: TopProduct[];
  recentTransactions: TransactionDto[];
}
