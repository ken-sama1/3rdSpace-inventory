import { productCategories } from "@/api/product-categories";
import type { DeleteProductCategoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    DeleteProductCategoryResult,
    Error,
    IdSchema
  >({
    mutationKey: ["categories", "products", "delete"],
    mutationFn: productCategories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) => {
          const [resource, type] = q.queryKey;

          return (
            resource === "products" ||
            (resource === "categories" && type === "products")
          );
        },
      });
    },
  });

  return {
    data,
    delete: mutateAsync,
    isError,
    error,
    isPending,
  };
};
