import type {
  GetTransactionsReqQueryInput,
  GetTransactionsResBody,
  GetTransactionsResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/transactions";

export const getMany = async (
  query: GetTransactionsReqQueryInput = {},
  config: AxiosRequestConfig
): Promise<GetTransactionsResult> => {
  const { data } = await api.get<GetTransactionsResBody>(baseUrl, {
    ...config,
    params: query,
  });

  return data.data;
};

export const transactionsApi = {
  getMany,
};
