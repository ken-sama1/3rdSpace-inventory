import {
  type CreateProductCategoryInput,
  type CreateProductCategoryResBody,
  type CreateProductCategoryResult,
  type DeleteProductCategoryResBody,
  type DeleteProductCategoryResult,
  type GetProductCategoriesResBody,
  type GetProductCategoriesResult,
  type GetProductCategoryByIdResBody,
  type GetProductCategoryByIdResult,
  type IdSchema,
  type UpdateProductCategoryInput,
  type UpdateProductCategoryResBody,
  type UpdateProductCategoryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/product-categories";

// --- Create ---
const create = async ({
  name,
}: CreateProductCategoryInput): Promise<CreateProductCategoryResult> => {
  const { data } = await api.post<CreateProductCategoryResBody>(
    `${baseUrl}/create`,
    { name }
  );

  return data.data;
};

// --- Update ---
const update = async (
  id: IdSchema,
  { name }: UpdateProductCategoryInput
): Promise<UpdateProductCategoryResult> => {
  const { data } = await api.patch<UpdateProductCategoryResBody>(
    `${baseUrl}/${id}`,
    { name }
  );

  return data.data;
};

// --- Delete ---
const remove = async (id: IdSchema): Promise<DeleteProductCategoryResult> => {
  const { data } = await api.delete<DeleteProductCategoryResBody>(
    `${baseUrl}/${id}`
  );

  return data.data;
};

// --- Get By Id ---
const getById = async (
  id: IdSchema,
  config?: AxiosRequestConfig
): Promise<GetProductCategoryByIdResult> => {
  const { data } = await api.get<GetProductCategoryByIdResBody>(
    `${baseUrl}/${id}`,
    {
      ...config,
    }
  );

  return data.data;
};

// --- Get Many ---
const getMany = async (
  {} = {},
  config?: AxiosRequestConfig
): Promise<GetProductCategoriesResult> => {
  const { data } = await api.get<GetProductCategoriesResBody>(baseUrl, {
    ...config,
  });

  return data.data;
};

export const productCategoriesApi = {
  getById,
  getMany,
  create,
  update,
  delete: remove,
};
