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
  ProductFilterSchema,
  UpdateProductInput,
  UpdateProductResBody,
  UpdateProductResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const baseUrl = "/products";

const get = async (
  productId: string,
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

const getAll = async (
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
  id: string,
  updatedFields: UpdateProductInput
): Promise<UpdateProductResult> => {
  const { data } = await api.patch<UpdateProductResBody>(
    `${baseUrl}/${id}`,
    updatedFields
  );

  return data.data;
};

const remove = async (id: string): Promise<DeleteProductResult> => {
  const { data } = await api.delete<DeleteProductResBody>(`${baseUrl}/${id}`);

  return data.data;
};

const deductStockForProduct = async (
  id: string,
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
  get,
  getAll,
  update,
  delete: remove,
  deductStockForProduct,
};
