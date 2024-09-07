import { Transaction } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useStats = () => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return await response.json();
      } catch (error) {
        return null;
      }
    },
  });

  return {
    isPending: isPending || isRefetching,
    error,
    stats: data,
    refetch,
  } as {
    isPending: boolean;
    error: any;
    stats: {
      totalAmount: number;
      numCustomers: number;
      numProducts: number;
      numSubscriptions: number;
      transactions: Transaction[];
    };
    refetch: () => void;
  };
};
