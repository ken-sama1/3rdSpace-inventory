import { prisma } from "@repo/database";
import type {
  GetReportSummaryReqQuerySchema,
  GetReportSummaryResult,
} from "@repo/shared";
import { toDateFilter } from "../mappers/filter.mapper.js";

export const getSummary = async ({
  filter,
}: GetReportSummaryReqQuerySchema): Promise<GetReportSummaryResult> => {
  const { period = "7d" } = filter ?? {};

  const start = new Date();
  if (period === "7d") {
    start.setDate(start.getDate() - 7);
  } else if (period === "30d") {
    start.setDate(start.getDate() - 30);
  } else {
    start.setTime(0);
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      createdAt: toDateFilter({
        start: start.toISOString(),
      }),
    },
    include: {
      transactionItems: true,
    },
  });

  const totalSales = transactions.reduce(
    (total, transaction) => total + transaction.totalPrice,
    0
  );
  const unitsSold = transactions.reduce(
    (total, transaction) =>
      total +
      transaction.transactionItems.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      ),
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

  for (const transaction of transactions) {
    const date = new Intl.DateTimeFormat("en-US").format(transaction.createdAt);
    const day = salesByDay.get(date) ?? {
      date,
      totalSales: 0,
      transactions: 0,
    };
    day.totalSales += transaction.totalPrice;
    day.transactions += 1;
    salesByDay.set(date, day);

    transaction.transactionItems.forEach((ti) => {
      const product = products.get(ti.productName) ?? {
        productName: ti.productName,
        unitsSold: 0,
        totalSales: 0,
      };
      product.unitsSold += ti.quantity;
      product.totalSales += ti.unitPrice * ti.quantity;
      products.set(ti.productName, product);
    });
  }

  return {
    period,
    summary: {
      totalSales,
      transactionCount: transactions.length,
      unitsSold,
      averageOrderValue: transactions.length
        ? totalSales / transactions.length
        : 0,
    },
    salesByDay: [...salesByDay.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    ),
    topProducts: [...products.values()]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5),
  };
};
