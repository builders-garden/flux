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
        const { transactions } = await response.json();
        return transactions;
      } catch (error) {
        return [];
      }
    },
  });

  return { isPending, error, transactions: data };
};
