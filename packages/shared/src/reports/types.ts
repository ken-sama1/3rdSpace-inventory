import type { IsoDateSchema } from "../common/schema.js";
import type { ReportPeriodSchema } from "./schema.js";

export interface Sale {
  date: string;
  totalSales: number;
  transactions: number;
}

export interface TopProduct {
  productName: string;
  unitsSold: number;
  totalSales: number;
}

export interface Transaction {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  transactionPrice: number;
  createdAt: IsoDateSchema;
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
  recentTransactions: Transaction[];
}
