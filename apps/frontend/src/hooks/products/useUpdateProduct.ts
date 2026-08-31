import { cloudinaryApi } from "@/api/cloudinary.api";
import { productsApi } from "@/api/products.api";
import type {
  IdParam,
  UpdateProductInput,
  UpdateProductResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, data, isError, isPending, error } = useMutation<
    UpdateProductResult,
    Error,
    IdParam & {
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
    update: mutateAsync,
    data,
    isError,
    isPending,
    error,
  };
};

export default useUpdateProduct;
