import { cloudinaryApi } from "@/api/cloudinary.api";
import { productsApi } from "@/api/products.api";
import type { CreateProductInput, CreateProductResult } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, error, isPending, isError, isSuccess } =
    useMutation<CreateProductResult, Error, CreateProductInput>({
      mutationKey: ["products", "create"],
      mutationFn: async ({
        imageUrl,
        categoryId,
        description,
        name,
        price,
        recipeItems,
      }) => {
        console.log(imageUrl);
        return await productsApi.create({
          categoryId,
          name,
          price,
          recipeItems,
          ...(categoryId && { categoryId }),
          ...(Boolean(price) && { price }),
          ...(description && { description }),
          ...(imageUrl && imageUrl !== null
            ? {
                imageUrl: await cloudinaryApi.upload(imageUrl),
              }
            : { imageUrl: null }),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
    });

  return {
    error,
    create: mutateAsync,
    isPending,
    isError,
    data,
    isSuccess,
  };
};
