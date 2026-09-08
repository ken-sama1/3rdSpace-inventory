import { productCategoriesApi } from "@/api/product-categories.api";
import type {
  IdParamSchema,
  UpdateProductCategoryInput,
  UpdateProductCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, ...rest } = useMutation<
    UpdateProductCategoryResult,
    Error,
    IdParamSchema & {
      data: UpdateProductCategoryInput;
    }
  >({
    mutationKey: ["categories", "products", "update"],
    mutationFn: async ({ id, data }) =>
      await productCategoriesApi.update(id, data),
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
    update,
    ...rest,
  };
};
