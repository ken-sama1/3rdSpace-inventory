import type {
  CreateInventoryItemInput,
  CreateInventoryItemResBody,
  CreateInventoryItemResult,
  DeleteInventoryItemResBody,
  DeleteInventoryResult,
  GetInventoryItemByIdResult,
  GetInventoryItemByIdResBody,
  GetInventoryItemsReqQuery,
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
  IdSchema,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-items";

const getById = async (
  id: IdSchema,
  config?: AxiosRequestConfig
): Promise<GetInventoryItemByIdResult> => {
  const { data } = await api.get<GetInventoryItemByIdResBody>(
    `${baseUrl}/${id}`,
    {
      ...config,
    }
  );

  return data.data;
};

const getMany = async (
  { filter, options }: GetInventoryItemsReqQuery = {},
  config?: AxiosRequestConfig
): Promise<GetInventoryItemsResult> => {
  const { data } = await api.get<GetInventoryItemsResBody>(baseUrl, {
    ...config,
    params: {
      filter,
      options,
    },
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
  id: IdSchema,
  fields: UpdateInventoryItemInput
): Promise<UpdateInventoryResult> => {
  const { data } = await api.patch<CreateInventoryItemResBody>(
    `${baseUrl}/${id}`,
    fields
  );

  return data.data;
};

const remove = async (id: IdSchema): Promise<DeleteInventoryResult> => {
  const { data } = await api.delete<DeleteInventoryItemResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};

const stockIn = async (
  id: IdSchema,
  { quantity }: StockInInventoryItemInput
): Promise<StockInInventoryItemResult> => {
  const { data } = await api.post<StockInInventoryItemResBody>(
    `${baseUrl}/${id}/stock-in`,
    { quantity }
  );

  return data.data;
};

const stockOut = async (
  id: IdSchema,
  { quantity, reason }: StockOutInventoryItemInput
): Promise<StockOutInventoryItemResult> => {
  const { data } = await api.post<StockOutInventoryItemResBody>(
    `${baseUrl}/${id}/stock-out`,
    { quantity, reason }
  );

  return data.data;
};

export const inventoryItemApi = {
  getById,
  getMany,
  create,
  update,
  delete: remove,
  stockOut,
  stockIn,
};
