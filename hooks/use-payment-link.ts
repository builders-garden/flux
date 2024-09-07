import { PaymentLink, Product, User } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

export const usePaymentLink = (slug: string) => {
  const { isPending, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["payment-link", slug],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/public/payment-links/${slug}`);
        return await response.json();
      } catch (error) {
        return null;
      }
    },
  });

  return {
    isPending: isPending || isRefetching,
    error,
    paymentLink: data as
      | (PaymentLink & { user: User; product: Product })
      | null,
    refetch,
  };
};
