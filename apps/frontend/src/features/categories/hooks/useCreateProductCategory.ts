import { productCategoriesApi } from "@/api/product-categories.api";
import type {
  CreateProductCategoryInput,
  CreateProductCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, ...rest } = useMutation<
    CreateProductCategoryResult,
    Error,
    CreateProductCategoryInput
  >({
    mutationKey: ["categories", "products", "create"],
    mutationFn: productCategoriesApi.create,
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
    create,
    ...rest,
  };
};
