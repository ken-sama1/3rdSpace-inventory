import {
  type AssignInventoryItemsToCategoryInput,
  type AssignInventoryItemsToCategoryResBody,
  type AssignInventoryItemsToCategoryResult,
  type CreateInventoryItemCategoryInput,
  type CreateInventoryItemCategoryResBody,
  type CreateInventoryItemCategoryResult,
  type DeleteInventoryItemCategoryResBody,
  type DeleteInventoryItemCategoryResult,
  type GetInventoryItemCategoriesResBody,
  type GetInventoryItemCategoriesResult,
  type GetInventoryItemCategoryByIdResBody,
  type GetInventoryItemCategoryByIdResult,
  type IdSchema,
  type UpdateInventoryItemCategoryInput,
  type UpdateInventoryItemCategoryResBody,
  type UpdateInventoryItemCategoryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/inventory-item-categories";

// --- Create ---
const create = async ({
  name,
}: CreateInventoryItemCategoryInput): Promise<CreateInventoryItemCategoryResult> => {
  const { data } = await api.post<CreateInventoryItemCategoryResBody>(
    `${baseUrl}/create`,
    { name }
  );

  return data.data;
};

// --- Update ---
const update = async (
  id: IdSchema,
  { name }: UpdateInventoryItemCategoryInput
): Promise<UpdateInventoryItemCategoryResult> => {
  const { data } = await api.patch<UpdateInventoryItemCategoryResBody>(
    `${baseUrl}/${id}`,
    { name }
  );

  return data.data;
};

// --- Delete ---
const remove = async (
  id: IdSchema
): Promise<DeleteInventoryItemCategoryResult> => {
  const { data } = await api.delete<DeleteInventoryItemCategoryResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};

// --- Get By Id ---
const getById = async (
  id: IdSchema,
  config?: AxiosRequestConfig
): Promise<GetInventoryItemCategoryByIdResult> => {
  const { data } = await api.get<GetInventoryItemCategoryByIdResBody>(
    `${baseUrl}/${id}`,
    { ...config }
  );

  return data.data;
};

// --- Get Many ---
const getMany = async (
  {} = {},
  config?: AxiosRequestConfig
): Promise<GetInventoryItemCategoriesResult> => {
  const { data } = await api.get<GetInventoryItemCategoriesResBody>(baseUrl, {
    ...config,
  });

  return data.data;
};

// --- Assign Items ---
export const assignItems = async (
  id: IdSchema,
  { inventoryItemIds }: AssignInventoryItemsToCategoryInput
): Promise<AssignInventoryItemsToCategoryResult> => {
  const { data } = await api.post<AssignInventoryItemsToCategoryResBody>(
    `${baseUrl}/${id}`,
    { inventoryItemIds }
  );

  return data.data;
};

export const inventoryItemCategories = {
  getById,
  getMany,
  create,
  update,
  delete: remove,
  assignItems,
};
