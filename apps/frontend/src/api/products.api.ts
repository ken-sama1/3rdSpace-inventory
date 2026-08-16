import type {
  CreateProductInput,
  CreateProductResBody,
  CreateProductResult,
  DeductStockForProductResBody,
  DeductStockForProductResult,
  DeleteProductResBody,
  DeleteProductResult,
  GetProductsByIdResBody,
  GetProductsResBody,
  GetProductsResult,
  UpdateProductInput,
  UpdateProductResBody,
  UpdateProductResult,
} from "@repo/shared";
import { api } from "./api";
import type { AxiosRequestConfig } from "axios";

const baseUrl = "/products";

const get = async (productId: string) => {
  productId;
};

const getAll = async (
  _filter: {},
  config: AxiosRequestConfig
): Promise<GetProductsResult> => {
  const { data } = await api.get<GetProductsResBody>(baseUrl, { ...config });

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
  id: string
): Promise<DeductStockForProductResult> => {
  const { data } = await api.post<DeductStockForProductResBody>(
    `${baseUrl}/${id}/deduct-stock`
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
