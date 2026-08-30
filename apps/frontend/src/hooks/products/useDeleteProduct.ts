import { productsApi } from "@/api/products.api";
import type { DeleteProductResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { data, isPending, mutateAsync, isError, error } = useMutation<
    DeleteProductResult,
    Error,
    IdSchema
  >({
    mutationKey: ["products", "delete"],
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    data,
    isPending,
    isError,
    error,
    delete: mutateAsync,
  };
};

export default useDeleteProduct;
