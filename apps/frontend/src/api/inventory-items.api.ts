import type {
  CreateInventoryItemInput,
  CreateInventoryItemResBody,
  CreateInventoryItemResult,
  DeleteInventoryItemResBody,
  DeleteInventoryResult,
  GetInventoryItemsResBody,
  GetInventoryItemsResult,
  UpdateInventoryItemInput,
  UpdateInventoryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-items";

/**
 * Remember to add filter
 * */
export const getInventoryItems = async (
  _?: {},
  config?: AxiosRequestConfig
): Promise<GetInventoryItemsResult> => {
  const { data } = await api.get<GetInventoryItemsResBody>(baseUrl, {
    ...config,
  });

  return data.data;
};

export const createInventoryItem = async (
  item: CreateInventoryItemInput
): Promise<CreateInventoryItemResult> => {
  const { data } = await api.post<CreateInventoryItemResBody>(
    `${baseUrl}/create`,
    item
  );

  return data.data;
};

export const updateInventoryItem = async (
  id: string,
  fields: UpdateInventoryItemInput
): Promise<UpdateInventoryResult> => {
  const { data } = await api.patch<CreateInventoryItemResBody>(
    `${baseUrl}/${id}`,
    fields
  );

  return data.data;
};

export const deleteInventoryItem = async (
  id: string
): Promise<DeleteInventoryResult> => {
  const { data } = await api.delete<DeleteInventoryItemResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};
