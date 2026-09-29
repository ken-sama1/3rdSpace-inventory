import { prisma } from "@repo/database";
import type {
  GetReportSummaryReqQuerySchema,
  GetReportSummaryResult,
} from "@repo/shared";

export const getSummary = async ({
  filter,
}: GetReportSummaryReqQuerySchema): Promise<GetReportSummaryResult> => {
  const { period = "7d" } = filter ?? {};
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const start = new Date();
  if (period === "7d") {
    start.setDate(start.getDate() - 7);
  } else if (period === "30d") {
    start.setDate(start.getDate() - 30);
  } else {
    start.setTime(0);
  }

  const filteredTransactions =
    period === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.createdAt >= start);

  const totalSales = filteredTransactions.reduce(
    (total, transaction) => total + transaction.transactionPrice,
    0
  );
  const unitsSold = filteredTransactions.reduce(
    (total, transaction) => total + transaction.quantity,
    0
  );

  const salesByDay = new Map<
    string,
    { date: string; totalSales: number; transactions: number }
  >();
  const products = new Map<
    string,
    { productName: string; unitsSold: number; totalSales: number }
  >();

  for (const transaction of filteredTransactions) {
    const date = transaction.createdAt.toISOString().slice(0, 10);
    const day = salesByDay.get(date) ?? {
      date,
      totalSales: 0,
      transactions: 0,
    };
    day.totalSales += transaction.transactionPrice;
    day.transactions += 1;
    salesByDay.set(date, day);

    const product = products.get(transaction.productName) ?? {
      productName: transaction.productName,
      unitsSold: 0,
      totalSales: 0,
    };
    product.unitsSold += transaction.quantity;
    product.totalSales += transaction.transactionPrice;
    products.set(transaction.productName, product);
  }

  return {
    period,
    summary: {
      totalSales,
      transactionCount: filteredTransactions.length,
      unitsSold,
      averageOrderValue: filteredTransactions.length
        ? totalSales / filteredTransactions.length
        : 0,
    },
    salesByDay: [...salesByDay.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    ),
    topProducts: [...products.values()]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5),
    recentTransactions: filteredTransactions
      .slice(0, 20)
      .map((transaction) => ({
        id: transaction.id,
        productName: transaction.productName,
        quantity: transaction.quantity,
        unitPrice: transaction.unitPrice,
        transactionPrice: transaction.transactionPrice,
        createdAt: transaction.createdAt.toISOString(),
      })),
  };
};
