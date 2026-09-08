import { productCategoriesApi } from "@/api/product-categories.api";
import type { DeleteProductCategoryResult, IdSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation<
    DeleteProductCategoryResult,
    Error,
    IdSchema
  >({
    mutationKey: ["categories", "products", "delete"],
    mutationFn: productCategoriesApi.delete,
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
    delete: mutateAsync,
    ...rest,
  };
};
