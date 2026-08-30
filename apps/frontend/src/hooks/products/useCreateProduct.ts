import { cloudinaryApi } from "@/api/cloudinary.api";
import { productsApi } from "@/api/products.api";
import type { CreateProductInput, CreateProductResult } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, error, isPending, isError, isSuccess } =
    useMutation<CreateProductResult, Error, CreateProductInput>({
      mutationKey: ["products", "create"],
      mutationFn: async ({ imageUrl, ...rest }) => {
        return await productsApi.create({
          ...rest,
          ...(imageUrl !== undefined &&
            imageUrl !== null && {
              imageUrl: await cloudinaryApi.upload(imageUrl),
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
    error,
    create: mutateAsync,
    isPending,
    isError,
    data,
    isSuccess,
  };
};

export default useCreateProduct;
