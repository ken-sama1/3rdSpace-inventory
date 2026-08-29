import { prisma } from "@repo/database";
import type {
  IdSchema,
  UpdateProductCategoryResult,
  UpdateProductCategorySchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductCategoryDto } from "../utils/product-category.mapper.js";

export const update = async (
  id: IdSchema,
  { name }: UpdateProductCategorySchema
): Promise<UpdateProductCategoryResult> => {
  const category = await prisma.productCategory.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category)
    throw new AppError({
      message: "Product category not found",
      code: "NOT_FOUND",
    });

  const result = await prisma.productCategory.update({
    where: { id },
    data: { name },
  });

  return toProductCategoryDto(result);
};
