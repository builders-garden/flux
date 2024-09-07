import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const usePaymentLinks = () => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["payment-links"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/payment-links", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return await response.json();
      } catch (error) {
        return [];
      }
    },
  });

  return { isPending: isPending || isRefetching, error, links: data, refetch };
};
