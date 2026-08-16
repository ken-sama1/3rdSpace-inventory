import { productsApi } from "@/api/products.api";
import { useQuery } from "@tanstack/react-query";

const useGetProducts = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => productsApi.getAll({}, { signal }),
  });

  return {
    isError,
    isLoading,
    data,
    error,
  };
};

export default useGetProducts;
