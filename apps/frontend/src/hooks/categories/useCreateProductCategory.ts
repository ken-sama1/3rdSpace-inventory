import { productCategories } from "@/api/product-categories";
import type {
  CreateProductCategoryInput,
  CreateProductCategoryResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isError, error, isPending } = useMutation<
    CreateProductCategoryResult,
    Error,
    CreateProductCategoryInput
  >({
    mutationKey: ["categories", "products", "create"],
    mutationFn: productCategories.create,
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
    create: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useCreateProductCategory;
