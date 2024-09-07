import { useProductsStore } from "@/lib/store";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const setProducts = useProductsStore((state) => state.setProducts);
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const products = await response.json();
        setProducts(products);
        return products;
      } catch (error) {
        return [];
      }
    },
  });

  return {
    isPending: isPending || isRefetching,
    error,
    products: data,
    refetch,
  };
};
