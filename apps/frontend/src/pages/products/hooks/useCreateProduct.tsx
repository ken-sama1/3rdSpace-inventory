import { productsApi } from "@/api/products.api";
import type { CreateProductInput, CreateProductResult } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isPending, isError, isSuccess } = useMutation<
    CreateProductResult,
    Error,
    CreateProductInput
  >({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    create: mutateAsync,
    isPending,
    isError,
    data,
    isSuccess,
  };
};

export default useCreateProduct;
