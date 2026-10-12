import type {
  GetInventoryLogsReqQueryInput,
  GetInventoryLogsResBody,
  GetInventoryLogsResult,
} from "@repo/shared";
import type { InternalAxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-logs";

const getMany = async (
  query: GetInventoryLogsReqQueryInput = {},
  config?: InternalAxiosRequestConfig
): Promise<GetInventoryLogsResult> => {
  const { data } = await api.get<GetInventoryLogsResBody>(baseUrl, {
    ...config,
    params: query,
  });

  return data.data;
};

export const inventoryLogsApi = {
  getMany,
};
