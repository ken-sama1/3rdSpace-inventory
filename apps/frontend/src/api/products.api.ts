import type {
  CreateProductInput,
  CreateProductResBody,
  CreateProductResult,
} from "@repo/shared";
import { api } from "./api";

const baseUrl = "/products";

const createProduct = async (
  product: CreateProductInput
): Promise<CreateProductResult> => {
  const { data } = await api.post<CreateProductResBody>(
    `${baseUrl}/create`,
    product
  );

  return data.data;
};

export const productsApi = {
  create: createProduct,
};
