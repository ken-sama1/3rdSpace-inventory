import { transactionsApi } from "@/api/transactions.api";
import type {
  GetTransactionsReqQuerySchema,
  GetTransactionsResult,
  IdSchema,
} from "@repo/shared";
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

type TransactionsQueryOptions = Omit<
  UseInfiniteQueryOptions<
    GetTransactionsResult,
    Error,
    InfiniteData<GetTransactionsResult>,
    readonly unknown[],
    IdSchema | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useGetTransactions = (
  query?: GetTransactionsReqQuerySchema,
  options?: TransactionsQueryOptions
) => {
  const limit = query?.options?.limit ?? 30;

  return useInfiniteQuery({
    queryKey: ["transactions", query?.filter, query?.options],
    initialPageParam: null as IdSchema | null,
    queryFn: ({ pageParam, signal }) =>
      transactionsApi.getMany(
        {
          ...query,
          options: {
            ...query?.options,
            lastTransactionId: pageParam ?? undefined,
          },
        },
        { signal }
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < limit) return undefined;
      return lastPage.at(-1)?.id;
    },
    ...options,
  });
};
