import { prisma } from "@repo/database";
import type {
  CreateProductCategoryResult,
  CreateProductCategorySchema,
} from "@repo/shared";
import { toProductCategoryDto } from "../utils/product-category.mapper.js";

export const create = async (
  data: CreateProductCategorySchema
): Promise<CreateProductCategoryResult> => {
  const result = await prisma.productCategory.create({
    data: {
      name: data.name,
    },
  });

  return toProductCategoryDto(result);
};
