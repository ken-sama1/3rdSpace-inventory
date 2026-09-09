import { cloudinaryApi } from "@/api/cloudinary.api";
import { productsApi } from "@/api/products.api";
import type {
  IdParamSchema,
  UpdateProductInput,
  UpdateProductResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, ...rest } = useMutation<
    UpdateProductResult,
    Error,
    IdParamSchema & {
      data: UpdateProductInput;
    }
  >({
    mutationKey: ["products", "update"],
    mutationFn: async ({ id, data }) => {
      const { name, imageUrl, price, categoryId, description, recipeItems } =
        data;
      return productsApi.update(id, {
        ...(name && name !== null && { name }),
        ...(imageUrl && {
          imageUrl: await cloudinaryApi.upload(imageUrl),
        }),
        ...(description && { description }),
        ...(typeof price === "number" && { price }),
        ...(categoryId && { categoryId }),
        ...(recipeItems &&
          recipeItems && {
            recipeItems,
          }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    update,
    ...rest,
  };
};
