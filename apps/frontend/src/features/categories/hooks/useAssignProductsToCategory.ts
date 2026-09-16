import { productCategoriesApi } from "@/api/product-categories.api";
import type {
  AssignProductsToCategoryInput,
  AssignProductsToCategoryResult,
  IdParamSchema,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssignProductsToCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: assignProducts, ...rest } = useMutation<
    AssignProductsToCategoryResult,
    Error,
    IdParamSchema & { data: AssignProductsToCategoryInput }
  >({
    mutationKey: ["categories", "products", "assign"],
    mutationFn: ({ id, data }) => productCategoriesApi.assignProducts(id, data),
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
    assignProducts,
    ...rest,
  };
};
