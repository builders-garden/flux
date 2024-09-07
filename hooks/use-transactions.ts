import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => {
  const { getAccessToken } = usePrivy();
  const { isPending, error, data } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("/api/transactions", {
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

  return { isPending, error, transactions: data };
};
