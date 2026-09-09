import { productsApi } from "@/api/products.api";
import type { DeleteProductResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation<
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
    delete: mutateAsync,
    ...rest,
  };
};
