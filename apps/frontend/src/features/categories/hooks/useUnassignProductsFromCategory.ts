import { productCategoriesApi } from "@/api/product-categories.api";
import type {
  IdParamSchema,
  UnassignProductsFromCategoryInput,
  UnassignProductsFromCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUnassignProductsFromCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: unassignProducts, ...rest } = useMutation<
    UnassignProductsFromCategoryResult,
    Error,
    IdParamSchema & {
      data: UnassignProductsFromCategoryInput;
    }
  >({
    mutationKey: ["categories", "products", "unassign"],
    mutationFn: ({ id, data }) =>
      productCategoriesApi.unassignProducts(id, data),
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
    unassignProducts,
    ...rest,
  };
};
