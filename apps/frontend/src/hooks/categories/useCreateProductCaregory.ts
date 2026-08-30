import { productCategories } from "@/api/product-categories";
import type {
  CreateInventoryItemCategoryInput,
  CreateInventoryItemCategoryResult,
} from "@repo/shared";
import { useMutation } from "@tanstack/react-query";

const useCreateProductCaregory = () => {
  const { data, mutateAsync, isError, error, isPending } = useMutation<
    CreateInventoryItemCategoryResult,
    Error,
    CreateInventoryItemCategoryInput
  >({
    mutationKey: ["categories", "create"],
    mutationFn: productCategories.create,
  });

  return {
    data,
    update: mutateAsync,
    isError,
    error,
    isPending,
  };
};

export default useCreateProductCaregory;
