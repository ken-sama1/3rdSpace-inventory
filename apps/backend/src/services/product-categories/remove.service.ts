import { prisma } from "@repo/database";
import type { DeleteInventoryItemCategoryResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductCategoryDto } from "../utils/product-category.mapper.js";

export const remove = async (
  id: IdSchema
): Promise<DeleteInventoryItemCategoryResult> => {
  const category = await prisma.productCategory.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category)
    throw new AppError({
      message: "Category not found",
      code: "NOT_FOUND",
    });

  const result = await prisma.$transaction(async (tsx) => {
    await tsx.product.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: null,
      },
    });

    return await tsx.productCategory.delete({
      where: {
        id,
      },
    });
  });

  return {
    createdAt: result.createAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    ...toProductCategoryDto(result),
  };
};
