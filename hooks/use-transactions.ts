import { Customer, Product, Transaction } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type TransactionWithData = Transaction & {
  customer: Customer;
  product: Product;
};

export const useTransactions = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { getAccessToken } = usePrivy();
  const { isPending, error, data, refetch } = useQuery<{
    transactions: TransactionWithData[];
    totalCount: number;
  }>({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        console.log({
          limit,
          page,
        });
        const response = await fetch(
          `/api/transactions?limit=${limit}&page=${page - 1}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        console.log("[useTransactions] data", data);
        return data;
      } catch (error) {
        return [];
      }
    },
  });

  return {
    isPending,
    error,
    data,
    refetch,
    page,
    limit,
    setPage,
    setLimit,
  };
};
