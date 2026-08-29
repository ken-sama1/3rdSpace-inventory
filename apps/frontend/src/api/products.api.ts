import type {
  CreateProductInput,
  CreateProductResBody,
  CreateProductResult,
  DeductStockForProductInput,
  DeductStockForProductResBody,
  DeductStockForProductResult,
  DeleteProductResBody,
  DeleteProductResult,
  GetProductByIdResBody,
  GetProductByIdResult,
  GetProductsResBody,
  GetProductsResult,
  IdSchema,
  ProductFilterSchema,
  UpdateProductInput,
  UpdateProductResBody,
  UpdateProductResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/products";

const getById = async (
  productId: IdSchema,
  config?: AxiosRequestConfig
): Promise<GetProductByIdResult> => {
  const { data } = await api.get<GetProductByIdResBody>(
    `${baseUrl}/${productId}`,
    {
      ...config,
    }
  );

  return data.data;
};

const getMany = async (
  filter: ProductFilterSchema = {},
  config: AxiosRequestConfig
): Promise<GetProductsResult> => {
  const { data } = await api.get<GetProductsResBody>(baseUrl, {
    ...config,
    params: filter,
  });

  return data.data;
};

const create = async (
  product: CreateProductInput
): Promise<CreateProductResult> => {
  const { data } = await api.post<CreateProductResBody>(
    `${baseUrl}/create`,
    product
  );

  return data.data;
};

const update = async (
  id: IdSchema,
  updatedFields: UpdateProductInput
): Promise<UpdateProductResult> => {
  const { data } = await api.patch<UpdateProductResBody>(
    `${baseUrl}/${id}`,
    updatedFields
  );

  return data.data;
};

const remove = async (id: IdSchema): Promise<DeleteProductResult> => {
  const { data } = await api.delete<DeleteProductResBody>(`${baseUrl}/${id}`);

  return data.data;
};

const deductStockForProduct = async (
  id: IdSchema,
  { quantity }: DeductStockForProductInput
): Promise<DeductStockForProductResult> => {
  const { data } = await api.post<DeductStockForProductResBody>(
    `${baseUrl}/${id}/deduct-stock`,
    { quantity }
  );

  return data.data;
};

export const productsApi = {
  create,
  getById,
  getMany,
  update,
  delete: remove,
  deductStockForProduct,
};
