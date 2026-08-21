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
  StockInInventoryItemInput,
  StockInInventoryItemResBody,
  StockInInventoryItemResult,
  StockOutInventoryItemInput,
  StockOutInventoryItemResBody,
  StockOutInventoryItemResult,
  UpdateInventoryItemInput,
  UpdateInventoryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-items";

const get = async (
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
const getAll = async (
  _filter?: {},
  config?: AxiosRequestConfig
): Promise<GetInventoryItemsResult> => {
  const { data } = await api.get<GetInventoryItemsResBody>(baseUrl, {
    ...config,
  });

  return data.data;
};

const create = async (
  item: CreateInventoryItemInput
): Promise<CreateInventoryItemResult> => {
  const { data } = await api.post<CreateInventoryItemResBody>(
    `${baseUrl}/create`,
    item
  );

  return data.data;
};

const update = async (
  id: string,
  fields: UpdateInventoryItemInput
): Promise<UpdateInventoryResult> => {
  const { data } = await api.patch<CreateInventoryItemResBody>(
    `${baseUrl}/${id}`,
    fields
  );

  return data.data;
};

const remove = async (id: string): Promise<DeleteInventoryResult> => {
  const { data } = await api.delete<DeleteInventoryItemResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};

const stockIn = async (
  id: string,
  { quantity }: StockInInventoryItemInput
): Promise<StockInInventoryItemResult> => {
  const { data } = await api.post<StockInInventoryItemResBody>(
    `${baseUrl}/${id}/stock-in`,
    { quantity }
  );

  return data.data;
};

const stockOut = async (
  id: string,
  { quantity, reason }: StockOutInventoryItemInput
): Promise<StockOutInventoryItemResult> => {
  const { data } = await api.post<StockOutInventoryItemResBody>(
    `${baseUrl}/${id}/stock-out`,
    { quantity, reason }
  );

  return data.data;
};

export const inventoryItemApi = {
  get,
  getAll,
  create,
  update,
  delete: remove,
  stockOut,
  stockIn,
};
