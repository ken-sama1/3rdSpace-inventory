import { productCategories } from "@/api/product-categories";
import type {
  IdParam,
  UpdateProductCategoryInput,
  UpdateProductCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    UpdateProductCategoryResult,
    Error,
    IdParam & {
      data: UpdateProductCategoryInput;
    }
  >({
    mutationKey: ["categories", "products", "update"],
    mutationFn: async ({ id, data }) =>
      await productCategories.update(id, data),
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
    update: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useUpdateProductCategory;
