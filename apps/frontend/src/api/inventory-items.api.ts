import type {
  CreateInventoryItemInput,
  CreateInventoryItemResBody,
  CreateInventoryItemResult,
  DeleteInventoryItemResBody,
  DeleteInventoryResult,
  GetInventoryItemResBody,
  GetInventoryItemResult,
  GetInventoryItemsResBody,
  GetInventoryItemsResult,
  UpdateInventoryItemInput,
  UpdateInventoryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-items";

const getInventoryItem = async (
  id: string,
  config?: AxiosRequestConfig
): Promise<GetInventoryItemResult> => {
  const { data } = await api.get<GetInventoryItemResBody>(`${baseUrl}/${id}`, {
    ...config,
  });

  return data.data;
};

/**
 * Remember to add filter
 * */
const getInventoryItems = async (
  _filter?: {},
  config?: AxiosRequestConfig
): Promise<GetInventoryItemsResult> => {
  const { data } = await api.get<GetInventoryItemsResBody>(baseUrl, {
    ...config,
  });

  return data.data;
};

const createInventoryItem = async (
  item: CreateInventoryItemInput
): Promise<CreateInventoryItemResult> => {
  const { data } = await api.post<CreateInventoryItemResBody>(
    `${baseUrl}/create`,
    item
  );

  return data.data;
};

const updateInventoryItem = async (
  id: string,
  fields: UpdateInventoryItemInput
): Promise<UpdateInventoryResult> => {
  const { data } = await api.patch<CreateInventoryItemResBody>(
    `${baseUrl}/${id}`,
    fields
  );

  return data.data;
};

const deleteInventoryItem = async (
  id: string
): Promise<DeleteInventoryResult> => {
  const { data } = await api.delete<DeleteInventoryItemResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};

export const inventoryItemApi = {
  get: getInventoryItem,
  getAll: getInventoryItems,
  create: createInventoryItem,
  update: updateInventoryItem,
  delete: deleteInventoryItem,
};
